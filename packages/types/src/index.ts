/**
 * Calendy Fit - Shared TypeScript Types
 * Generated from PostgreSQL schema - hand-maintained for type safety
 */

// =============================================================================
// Enums
// =============================================================================
export type UserRole = 'client' | 'trainer' | 'admin';
export type AuthProvider = 'email' | 'google' | 'apple' | 'anonymous';
export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type AppointmentType = 'in_person' | 'online';
export type NotificationType = 'appointment_reminder' | 'appointment_confirmed' | 'appointment_cancelled' | 'appointment_rescheduled' | 'new_booking' | 'payment_received' | 'payment_failed' | 'review_received' | 'message' | 'system' | 'promotional';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'google_pay' | 'apple_pay' | 'stripe' | 'razorpay' | 'cash';
export type CancellationRole = 'client' | 'trainer' | 'admin' | 'system';
export type ServiceCategory = 'personal_training' | 'online_coaching' | 'yoga' | 'crossfit' | 'diet_consultation' | 'bodybuilding' | 'weight_loss' | 'strength_training' | 'physiotherapy' | 'nutrition' | 'cardio' | 'flexibility' | 'other';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TimeOffType = 'break' | 'holiday' | 'sick' | 'personal';

// =============================================================================
// Database Row Types (mirrors PostgreSQL schema)
// =============================================================================
export interface Profile {
  id: string;
  email: string | null;
  name: string;
  role: UserRole;
  auth_provider: AuthProvider;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  timezone: string;
  is_onboarded: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  push_notifications: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  appointment_reminders: boolean;
  promotional_emails: boolean;
  show_profile_photo: boolean;
  show_online_status: boolean;
  share_progress: boolean;
  calendar_sync: boolean;
  theme: 'dark' | 'light' | 'system';
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Trainer {
  id: string;
  user_id: string;
  bio: string | null;
  experience_years: number;
  specialties: string[];
  languages: string[];
  rating: number;
  total_reviews: number;
  total_clients: number;
  total_sessions: number;
  hourly_rate: number;
  currency: string;
  is_verified: boolean;
  is_available: boolean;
  location_address: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  location_lat: number | null;
  location_lng: number | null;
  is_gym: boolean;
  gym_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrainerSocialLink {
  id: string;
  trainer_id: string;
  platform: 'instagram' | 'youtube' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok' | 'website';
  url: string;
  created_at: string;
}

export interface TrainerCertification {
  id: string;
  trainer_id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_url: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  currency: string;
  category: ServiceCategory;
  is_online: boolean;
  is_in_person: boolean;
  max_clients_per_session: number;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  trainer_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeOff {
  id: string;
  trainer_id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  type: TimeOffType;
  created_at: string;
}

export interface Appointment {
  id: string;
  trainer_id: string;
  client_id: string;
  service_id: string;
  service_name: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  type: AppointmentType;
  location_name: string | null;
  location_address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  meet_link: string | null;
  google_calendar_event_id: string | null;
  notes: string | null;
  client_notes: string | null;
  price: number;
  currency: string;
  is_paid: boolean;
  payment_id: string | null;
  is_recurring: boolean;
  reschedule_count: number;
  reminder_sent: boolean;
  cancelled_by: CancellationRole | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  refund_amount: number | null;
  refund_processed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  appointment_id: string;
  client_id: string;
  trainer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  appointment_id: string;
  client_id: string;
  trainer_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod | null;
  stripe_payment_intent_id: string | null;
  promo_code: string | null;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  invoice_url: string | null;
  paid_at: string | null;
  refunded_at: string | null;
  refund_amount: number | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  appointment_id: string;
  client_id: string;
  trainer_id: string;
  subtotal: number;
  tax: number;
  tax_rate: number;
  discount: number;
  promo_code: string | null;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string | null;
  paid_at: string | null;
  pdf_url: string | null;
  created_at: string;
}

export interface ClientProgress {
  id: string;
  client_id: string;
  trainer_id: string;
  date: string;
  weight: number | null;
  body_fat_percentage: number | null;
  chest_measurement: number | null;
  waist_measurement: number | null;
  hips_measurement: number | null;
  arms_measurement: number | null;
  thighs_measurement: number | null;
  measurement_unit: 'cm' | 'inches';
  photos: string[];
  notes: string | null;
  mood: number | null;
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  client_id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  frequency_per_week: number;
  duration_weeks: number;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  workout_plan_id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  rest_seconds: number;
  notes: string | null;
  sort_order: number;
  created_at: string;
}

export interface DietPlan {
  id: string;
  client_id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  daily_calories: number | null;
  restrictions: string[];
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  id: string;
  diet_plan_id: string;
  name: string;
  time_of_day: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fats_g: number | null;
  sort_order: number;
  created_at: string;
}

export interface GoogleCalendarToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  expiry_date: string | null;
  calendar_id: string;
  is_connected: boolean;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// API Types (DTOs)
// =============================================================================
export interface CreateAppointmentDTO {
  trainer_id: string;
  service_id: string;
  start_time: string;
  notes?: string;
  type: AppointmentType;
  location_name?: string;
  location_address?: string;
}

export interface RescheduleAppointmentDTO {
  appointment_id: string;
  new_start_time: string;
  reason?: string;
}

export interface CancelAppointmentDTO {
  appointment_id: string;
  reason?: string;
}

export interface CreateReviewDTO {
  appointment_id: string;
  rating: number;
  comment?: string;
}

export interface CreateProgressDTO {
  client_id: string;
  weight?: number;
  body_fat_percentage?: number;
  notes?: string;
}

export interface BookingTimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
  trainer_id: string;
}

// =============================================================================
// Navigation Types
// =============================================================================
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  '(trainer)': undefined;
  '(admin)': undefined;
};

export type AuthStackParamList = {
  login: undefined;
  register: undefined;
  'forgot-password': undefined;
  'auth-callback': undefined;
};
