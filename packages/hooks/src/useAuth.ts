/**
 * Calendy Fit - useAuth Hook (Shared)
 * Platform-agnostic authentication hook using Supabase
 */

import { useEffect, useState, useCallback } from 'react';
import { supabaseAuth } from '@calendy/api';
import { getSupabaseClient } from '@calendy/api';
import type { Session, User, AuthError } from '@supabase/supabase-js';
import type { Profile, UserRole } from '@calendy/types';
import { DB_TABLES } from '@calendy/config';

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const session = await supabaseAuth.getSession();
        if (session?.user) {
          await loadProfile(session.user.id);
          setState((s) => ({
            ...s,
            user: session.user,
            session,
            isAuthenticated: true,
            isLoading: false,
          }));
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      } catch {
        setState((s) => ({ ...s, isLoading: false }));
      }
    };
    init();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const { data: listener } = getSupabaseClient().auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await loadProfile(session.user.id);
          setState((s) => ({
            ...s,
            user: session.user,
            session,
            profile,
            isAuthenticated: true,
            isLoading: false,
          }));
        } else {
          setState((s) => ({
            ...s,
            user: null,
            session: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const loadProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const db = getSupabaseClient();
      const { data } = await db.from(DB_TABLES.PROFILES).select('*').eq('id', userId).single();
      return data as Profile | null;
    } catch {
      return null;
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await supabaseAuth.signIn(email, password);
      return data;
    } catch (err) {
      const message = (err as AuthError).message || 'Sign in failed';
      setState((s) => ({ ...s, error: message, isLoading: false }));
      throw err;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, unknown>) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      return await supabaseAuth.signUp(email, password, metadata);
    } catch (err) {
      const message = (err as AuthError).message || 'Sign up failed';
      setState((s) => ({ ...s, error: message, isLoading: false }));
      throw err;
    } finally {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      return await supabaseAuth.signInWithGoogle();
    } catch (err) {
      const message = (err as AuthError).message || 'Google sign-in failed';
      setState((s) => ({ ...s, error: message, isLoading: false }));
      throw err;
    } finally {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabaseAuth.signOut();
    setState({
      user: null, session: null, profile: null,
      isLoading: false, isAuthenticated: false, error: null,
    });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await supabaseAuth.resetPassword(email);
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile: async (updates: Partial<Profile>) => {
      if (!state.user) return;
      const db = getSupabaseClient();
      await db.from(DB_TABLES.PROFILES).update(updates).eq('id', state.user.id);
      setState((s) => ({ ...s, profile: { ...s.profile!, ...updates } }));
    },
  };
}
