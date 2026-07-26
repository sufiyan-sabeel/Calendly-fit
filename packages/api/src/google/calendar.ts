/**
 * Calendy Fit - Google Calendar Integration Service
 * OAuth, event CRUD, two-way sync, Meet link generation, conflict detection
 */

import { getSupabaseClient } from '../supabase/client';
import { DB_TABLES } from '@calendy/config';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
  meetLink?: string;
  calendarId?: string;
}

export interface SyncResult {
  synced: number;
  failed: number;
  errors: string[];
}

export class GoogleCalendarService {
  /**
   * Create a Google Calendar event with optional Google Meet
   */
  async createEvent(
    accessToken: string,
    event: {
      summary: string;
      description?: string;
      startTime: string;
      endTime: string;
      attendees?: { email: string; displayName?: string }[];
      addMeet?: boolean;
    }
  ): Promise<{ eventId: string; meetLink: string | null; htmlLink: string }> {
    const body: Record<string, unknown> = {
      summary: event.summary,
      description: event.description || '',
      start: { dateTime: event.startTime, timeZone: 'UTC' },
      end: { dateTime: event.endTime, timeZone: 'UTC' },
      ...(event.attendees && { attendees: event.attendees }),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    if (event.addMeet) {
      body.conferenceData = {
        createRequest: {
          requestId: `calendy-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/primary/events?conferenceDataVersion=1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Google Calendar API: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      eventId: data.id,
      meetLink: data.conferenceData?.entryPoints?.[0]?.uri || null,
      htmlLink: data.htmlLink,
    };
  }

  /**
   * Update an existing calendar event
   */
  async updateEvent(
    accessToken: string,
    eventId: string,
    updates: {
      summary?: string;
      description?: string;
      startTime?: string;
      endTime?: string;
    }
  ): Promise<void> {
    const body: Record<string, unknown> = {};
    if (updates.summary) body.summary = updates.summary;
    if (updates.description) body.description = updates.description;
    if (updates.startTime) body.start = { dateTime: updates.startTime, timeZone: 'UTC' };
    if (updates.endTime) body.end = { dateTime: updates.endTime, timeZone: 'UTC' };

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/primary/events/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Google Calendar API: ${err.error?.message || response.statusText}`);
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(accessToken: string, eventId: string): Promise<void> {
    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Google Calendar API: ${err.error?.message || response.statusText}`);
    }
  }

  /**
   * List events in a date range
   */
  async listEvents(
    accessToken: string,
    startDate: string,
    endDate: string
  ): Promise<CalendarEvent[]> {
    const params = new URLSearchParams({
      timeMin: new Date(startDate).toISOString(),
      timeMax: new Date(endDate).toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/primary/events?${params}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Google Calendar API: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return (data.items || []).map((item: any) => ({
      id: item.id,
      summary: item.summary || 'No title',
      description: item.description,
      startTime: item.start?.dateTime || item.start?.date,
      endTime: item.end?.dateTime || item.end?.date,
      meetLink: item.conferenceData?.entryPoints?.[0]?.uri,
      calendarId: item.organizer?.email || 'primary',
    }));
  }

  /**
   * Check for conflicting events (double-booking prevention)
   */
  async checkForConflicts(
    accessToken: string,
    startTime: string,
    endTime: string
  ): Promise<CalendarEvent[]> {
    const events = await this.listEvents(accessToken, startTime, endTime);
    return events.filter((e) => {
      const eStart = new Date(e.startTime).getTime();
      const eEnd = new Date(e.endTime).getTime();
      const s = new Date(startTime).getTime();
      const e = new Date(endTime).getTime();
      return eStart < e && eEnd > s; // overlapping
    });
  }

  /**
   * Store Google Calendar OAuth tokens for a user
   */
  async storeTokens(
    userId: string,
    tokens: {
      accessToken: string;
      refreshToken?: string;
      expiryDate?: string;
    }
  ): Promise<void> {
    const db = getSupabaseClient();
    const { error } = await db.from(DB_TABLES.GOOGLE_CALENDAR_TOKENS).upsert({
      user_id: userId,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expiry_date: tokens.expiryDate,
      is_connected: true,
      last_synced_at: new Date().toISOString(),
    });

    if (error) throw error;
  }

  /**
   * Disconnect Google Calendar for a user
   */
  async disconnect(userId: string): Promise<void> {
    const db = getSupabaseClient();
    const { error } = await db
      .from(DB_TABLES.GOOGLE_CALENDAR_TOKENS)
      .update({
        is_connected: false,
        access_token: null,
        refresh_token: null,
      })
      .eq('user_id', userId);

    if (error) throw error;
  }
}

export const googleCalendar = new GoogleCalendarService();
