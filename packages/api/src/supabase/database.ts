/**
 * Calendy Fit - Supabase Database Service
 * Generic CRUD, real-time subscriptions, and query helpers
 */

import { getSupabaseClient } from './client';
import type { SupabaseClient } from './client';
import {
  type PostgrestFilterBuilder,
  type PostgrestSingleResponse,
  type RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';

export class SupabaseDatabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = getSupabaseClient();
  }

  // ---- Generic CRUD ----

  async create<T extends Record<string, unknown>>(
    table: string,
    data: T
  ): Promise<T & { id: string }> {
    const { data: result, error } = await this.client
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result as T & { id: string };
  }

  async get<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await this.client
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data as T | null;
  }

  async update<T extends Record<string, unknown>>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<T> {
    const { data: result, error } = await this.client
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  async delete(table: string, id: string): Promise<void> {
    const { error } = await this.client
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async upsert<T extends Record<string, unknown>>(
    table: string,
    data: T,
    conflictColumn?: string
  ): Promise<T> {
    const { data: result, error } = await this.client
      .from(table)
      .upsert(data, { onConflict: conflictColumn })
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  // ---- Query Builders ----

  from(table: string) {
    return this.client.from(table);
  }

  async list<T>(
    table: string,
    options?: {
      column?: string;
      ascending?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<T[]> {
    let query = this.client.from(table).select('*');

    if (options?.column) {
      query = query.order(options.column, {
        ascending: options?.ascending ?? true,
      });
    }

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);

    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  }

  async findBy<T>(
    table: string,
    field: string,
    value: unknown
  ): Promise<T[]> {
    const { data, error } = await this.client
      .from(table)
      .select('*')
      .eq(field, value);

    if (error) throw error;
    return data as T[];
  }

  async findOneBy<T>(
    table: string,
    field: string,
    value: unknown
  ): Promise<T | null> {
    const { data, error } = await this.client
      .from(table)
      .select('*')
      .eq(field, value)
      .maybeSingle();

    if (error) throw error;
    return data as T | null;
  }

  // ---- Count ----

  async count(table: string, field?: string, value?: unknown): Promise<number> {
    let query = this.client.from(table).select('*', { count: 'exact', head: true });

    if (field && value !== undefined) {
      query = query.eq(field, value);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  // ---- Real-time Subscriptions ----

  subscribeToChanges<T>(
    table: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    filter?: Record<string, unknown>,
    callback: (payload: RealtimePostgresChangesPayload<T>) => void
  ) {
    const channelName = `${table}:${event}:${Date.now()}`;

    let subscription = this.client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
          ...(filter?.filter ? { filter: filter.filter as string } : {}),
        },
        (payload) => callback(payload as RealtimePostgresChangesPayload<T>)
      )
      .subscribe();

    return () => {
      this.client.removeChannel(subscription);
    };
  }

  subscribeToTable<T>(
    table: string,
    callback: (payload: RealtimePostgresChangesPayload<T>) => void
  ): () => void {
    return this.subscribeToChanges<T>(table, '*', undefined, callback);
  }

  // ---- Transactions (via RPC) ----

  async rpc<T>(fn: string, params?: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.client.rpc(fn, params);
    if (error) throw error;
    return data as T;
  }
}

export const supabaseDB = new SupabaseDatabaseService();
