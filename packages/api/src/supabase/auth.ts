/**
 * Calendy Fit - Supabase Authentication Service
 * Email/Password, Google OAuth, Session management
 */

import { AuthError, type User, type Session } from '@supabase/supabase-js';
import { getSupabaseClient } from './client';
import type { SupabaseClient } from './client';

export class SupabaseAuthService {
  private client: SupabaseClient;

  constructor() {
    this.client = getSupabaseClient();
  }

  // ---- Session ----

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async getUser(): Promise<User | null> {
    const { data, error } = await this.client.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  // ---- Email & Password ----

  async signUp(email: string, password: string, metadata?: Record<string, unknown>) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: this.getRedirectUrl(),
      },
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  // ---- Google OAuth ----

  async signInWithGoogle() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: this.getRedirectUrl(),
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/contacts.readonly',
          'https://www.googleapis.com/auth/drive.file',
          'email',
          'profile',
        ].join(' '),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    return data;
  }

  // ---- Password Management ----

  async resetPassword(email: string) {
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${this.getRedirectUrl()}/reset-password`,
    });
    if (error) throw error;
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.client.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }

  // ---- Session Management ----

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async refreshSession() {
    const { data, error } = await this.client.auth.refreshSession();
    if (error) throw error;
    return data.session;
  }

  // ---- Helpers ----

  getRedirectUrl(): string {
    if (typeof window !== 'undefined' && window.location) {
      // Web platform
      return `${window.location.origin}/auth/callback`;
    }
    // Mobile platform - uses deep link
    return 'calendyfit://auth/callback';
  }

  getAuthError(error: AuthError): string {
    const messages: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password.',
      'Email not confirmed': 'Please verify your email address.',
      'User already registered': 'An account with this email already exists.',
      'Password should be at least 6 characters': 'Password must be at least 6 characters.',
      'Rate limit exceeded': 'Too many attempts. Please try again later.',
    };
    return messages[error.message] || error.message;
  }
}

export const supabaseAuth = new SupabaseAuthService();
