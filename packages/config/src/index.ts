/**
 * Calendy Fit - Shared Configuration
 * Environment variables, constants, and platform detection
 */

// Environment variable access
function getEnv(key: string, defaultValue = ''): string {
  if (typeof process !== 'undefined' && process.env) {
    return (process.env[key] as string) || defaultValue;
  }
  return defaultValue;
}

export const config = {
  // App
  appName: 'Calendy Fit',
  appVersion: '1.0.0',

  // Supabase - will be set by each platform's env
  supabaseUrl: '',
  supabaseAnonKey: '',

  // Google
  googleClientId: '',
  googleCalendarApiKey: '',
  googleMapsApiKey: '',

  // Platform
  isServer: typeof window === 'undefined',
  isClient: typeof window !== 'undefined',
  isNative: typeof navigator !== 'undefined' && navigator.product === 'ReactNative',
  isWeb: typeof window !== 'undefined' && typeof document !== 'undefined',
};

export function initConfig(platform: 'mobile' | 'web'): void {
  if (platform === 'mobile') {
    config.supabaseUrl = getEnv('EXPO_PUBLIC_SUPABASE_URL');
    config.supabaseAnonKey = getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
    config.googleClientId = getEnv('EXPO_PUBLIC_GOOGLE_CLIENT_ID');
    config.googleCalendarApiKey = getEnv('EXPO_PUBLIC_GOOGLE_CALENDAR_API_KEY');
    config.googleMapsApiKey = getEnv('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY');
  } else {
    config.supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    // Accept both ANON_KEY and PUBLISHABLE_KEY (they are the same value)
    config.supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
    config.googleClientId = getEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID');
    config.googleCalendarApiKey = getEnv('NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY');
    config.googleMapsApiKey = getEnv('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
  }
}

// Database constants
export const DB_TABLES = {
  PROFILES: 'profiles',
  USER_SETTINGS: 'user_settings',
  TRAINERS: 'trainers',
  TRAINER_SOCIAL_LINKS: 'trainer_social_links',
  TRAINER_CERTIFICATIONS: 'trainer_certifications',
  SERVICES: 'services',
  AVAILABILITY: 'availability',
  TIME_OFF: 'time_off',
  APPOINTMENTS: 'appointments',
  RECURRING_RULES: 'recurring_rules',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  PAYMENTS: 'payments',
  INVOICES: 'invoices',
  CLIENT_PROGRESS: 'client_progress',
  WORKOUT_PLANS: 'workout_plans',
  EXERCISES: 'exercises',
  DIET_PLANS: 'diet_plans',
  MEALS: 'meals',
  GOOGLE_CALENDAR_TOKENS: 'google_calendar_tokens',
  AUDIT_LOGS: 'audit_logs',
} as const;

// Storage buckets
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  TRAINER_CERTIFICATES: 'trainer-certificates',
  PROGRESS_PHOTOS: 'progress-photos',
  DOCUMENTS: 'documents',
  BOOKING_FILES: 'booking-files',
  SERVICE_IMAGES: 'service-images',
} as const;

// Time constants
export const TIME = {
  MINUTES_IN_HOUR: 60,
  HOURS_IN_DAY: 24,
  SLOT_DURATION: 30,
  MIN_APPOINTMENT_DURATION: 15,
  MAX_APPOINTMENT_DURATION: 180,
  DEFAULT_BUFFER_TIME: 15,
  REMINDER_INTERVALS: [24, 2, 1],
};

// Booking limits
export const BOOKING_LIMITS = {
  MIN_ADVANCE_HOURS: 2,
  MAX_ADVANCE_DAYS: 90,
  MAX_FUTURE_BOOKINGS: 30,
  MAX_ACTIVE_BOOKINGS: 10,
  CANCELLATION_WINDOW_HOURS: 24,
  RESCHEDULE_WINDOW_HOURS: 12,
};

// Service categories
export const SERVICE_CATEGORIES = [
  { value: 'personal_training', label: 'Personal Training', icon: 'Dumbbell' },
  { value: 'online_coaching', label: 'Online Coaching', icon: 'Laptop' },
  { value: 'yoga', label: 'Yoga', icon: 'Sparkles' },
  { value: 'crossfit', label: 'CrossFit', icon: 'Flame' },
  { value: 'diet_consultation', label: 'Diet Consultation', icon: 'Apple' },
  { value: 'bodybuilding', label: 'Bodybuilding', icon: 'Muscle' },
  { value: 'weight_loss', label: 'Weight Loss', icon: 'TrendingDown' },
  { value: 'strength_training', label: 'Strength Training', icon: 'Shield' },
  { value: 'physiotherapy', label: 'Physiotherapy', icon: 'HeartPulse' },
  { value: 'nutrition', label: 'Nutrition', icon: 'Salad' },
  { value: 'cardio', label: 'Cardio', icon: 'Heart' },
  { value: 'flexibility', label: 'Flexibility', icon: 'Stretch' },
] as const;

// Days of week
export const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
] as const;
