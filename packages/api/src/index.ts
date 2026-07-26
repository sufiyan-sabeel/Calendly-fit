/**
 * Calendy Fit - API Package
 * Supabase services and Google integrations
 */

// Supabase
export { getSupabaseClient, getServiceClient, resetClient } from './supabase/client';
export { supabaseAuth, SupabaseAuthService } from './supabase/auth';
export { supabaseDB, SupabaseDatabaseService } from './supabase/database';
export { supabaseStorage, SupabaseStorageService } from './supabase/storage';

// Google
export { googleCalendar, GoogleCalendarService } from './google/calendar';
export { googleContacts, GoogleContactsService } from './google/contacts';
