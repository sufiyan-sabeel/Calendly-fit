-- =============================================================================
-- Calendy Fit - Complete PostgreSQL Schema
-- Supabase Database Schema with RLS, Indexes, and Functions
-- =============================================================================

-- 0. Extensions
create extension if not exists "uuid-ossp" schema extensions;
create extension if not exists "pgcrypto" schema extensions;
create extension if not exists "moddatetime" schema extensions;

-- =============================================================================
-- 1. ENUMS
-- =============================================================================

create type user_role as enum ('client', 'trainer', 'admin');
create type auth_provider as enum ('email', 'google', 'apple', 'anonymous');
create type appointment_status as enum ('pending', 'confirmed', 'rescheduled', 'in_progress', 'completed', 'cancelled', 'no_show');
create type appointment_type as enum ('in_person', 'online');
create type notification_type as enum ('appointment_reminder', 'appointment_confirmed', 'appointment_cancelled', 'appointment_rescheduled', 'new_booking', 'payment_received', 'payment_failed', 'review_received', 'message', 'system', 'promotional');
create type payment_status as enum ('pending', 'completed', 'failed', 'refunded', 'partially_refunded');
create type payment_method as enum ('credit_card', 'debit_card', 'google_pay', 'apple_pay', 'stripe', 'razorpay', 'cash');
create type cancellation_role as enum ('client', 'trainer', 'admin', 'system');
create type service_category as enum ('personal_training', 'online_coaching', 'yoga', 'crossfit', 'diet_consultation', 'bodybuilding', 'weight_loss', 'strength_training', 'physiotherapy', 'nutrition', 'cardio', 'flexibility', 'other');
create type day_of_week as enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
create type time_off_type as enum ('break', 'holiday', 'sick', 'personal');

-- =============================================================================
-- 2. TABLES
-- =============================================================================

-- 2.1 Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text not null,
  role user_role not null default 'client',
  auth_provider auth_provider not null default 'email',
  avatar_url text,
  phone text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other')),
  timezone text not null default 'UTC',
  is_onboarded boolean not null default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.2 User Settings
create table public.user_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  push_notifications boolean not null default true,
  email_notifications boolean not null default true,
  sms_notifications boolean not null default false,
  appointment_reminders boolean not null default true,
  promotional_emails boolean not null default false,
  show_profile_photo boolean not null default true,
  show_online_status boolean not null default false,
  share_progress boolean not null default false,
  calendar_sync boolean not null default false,
  theme text not null default 'dark' check (theme in ('dark', 'light', 'system')),
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.3 Trainer Profiles
create table public.trainers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  bio text,
  experience_years int default 0,
  specialties text[] default '{}',
  languages text[] default '{English}',
  rating decimal(3,2) default 0.00 check (rating >= 0 and rating <= 5),
  total_reviews int not null default 0,
  total_clients int not null default 0,
  total_sessions int not null default 0,
  hourly_rate decimal(10,2) not null default 0,
  currency text not null default 'USD',
  is_verified boolean not null default false,
  is_available boolean not null default true,
  location_address text,
  location_city text,
  location_state text,
  location_country text,
  location_lat decimal(10,7),
  location_lng decimal(10,7),
  is_gym boolean default false,
  gym_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.4 Trainer Social Links
create table public.trainer_social_links (
  id uuid primary key default uuid_generate_v4(),
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'youtube', 'twitter', 'linkedin', 'facebook', 'tiktok', 'website')),
  url text not null,
  created_at timestamptz not null default now()
);

-- 2.5 Trainer Certifications
create table public.trainer_certifications (
  id uuid primary key default uuid_generate_v4(),
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  name text not null,
  issuer text not null,
  issue_date date not null,
  expiry_date date,
  credential_url text,
  image_url text,
  created_at timestamptz not null default now()
);

-- 2.6 Services (offered by trainers)
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes int not null check (duration_minutes >= 15 and duration_minutes <= 180),
  price decimal(10,2) not null check (price >= 0),
  currency text not null default 'USD',
  category service_category not null,
  is_online boolean not null default false,
  is_in_person boolean not null default true,
  max_clients_per_session int not null default 1,
  buffer_before_minutes int not null default 0,
  buffer_after_minutes int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.7 Trainer Availability
create table public.availability (
  id uuid primary key default uuid_generate_v4(),
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  day_of_week day_of_week not null,
  start_time time not null,
  end_time time not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_time_range check (start_time < end_time),
  unique (trainer_id, day_of_week, start_time)
);

-- 2.8 Time Off / Breaks / Holidays
create table public.time_off (
  id uuid primary key default uuid_generate_v4(),
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  date date not null,
  start_time time,
  end_time time,
  reason text,
  type time_off_type not null default 'break',
  created_at timestamptz not null default now(),
  constraint valid_time_off check (start_time is null or end_time is null or start_time < end_time)
);

-- 2.9 Appointments
create table public.appointments (
  id uuid primary key default uuid_generate_v4(),
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete set null,
  service_name text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_minutes int not null,
  status appointment_status not null default 'pending',
  type appointment_type not null default 'in_person',
  location_name text,
  location_address text,
  location_lat decimal(10,7),
  location_lng decimal(10,7),
  meet_link text,
  google_calendar_event_id text,
  notes text,
  client_notes text,
  price decimal(10,2) not null default 0,
  currency text not null default 'USD',
  is_paid boolean not null default false,
  payment_id text,
  is_recurring boolean not null default false,
  reschedule_count int not null default 0,
  reminder_sent boolean not null default false,
  cancelled_by cancellation_role,
  cancelled_at timestamptz,
  cancellation_reason text,
  refund_amount decimal(10,2),
  refund_processed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_time_range check (start_time < end_time),
  constraint valid_duration check (duration_minutes > 0)
);

-- 2.10 Recurring Appointment Rules
create table public.recurring_rules (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null references public.appointments(id) on delete cascade unique,
  frequency text not null check (frequency in ('daily', 'weekly', 'biweekly', 'monthly')),
  interval_val int not null default 1,
  end_date date,
  max_occurrences int,
  days_of_week int[] default '{}',
  created_at timestamptz not null default now()
);

-- 2.11 Appointment Reviews
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (appointment_id, client_id)
);

-- 2.12 Notifications
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  type notification_type not null,
  data jsonb default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_unread on public.notifications(user_id, read) where read = false;

-- 2.13 Payments
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  amount decimal(10,2) not null,
  currency text not null default 'USD',
  status payment_status not null default 'pending',
  method payment_method,
  stripe_payment_intent_id text,
  promo_code text,
  discount_amount decimal(10,2) default 0,
  tax_amount decimal(10,2) default 0,
  total_amount decimal(10,2) not null,
  invoice_url text,
  paid_at timestamptz,
  refunded_at timestamptz,
  refund_amount decimal(10,2),
  created_at timestamptz not null default now()
);

-- 2.14 Invoices
create table public.invoices (
  id uuid primary key default uuid_generate_v4(),
  invoice_number text not null unique,
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  subtotal decimal(10,2) not null,
  tax decimal(10,2) not null default 0,
  tax_rate decimal(5,2) default 0,
  discount decimal(10,2) default 0,
  promo_code text,
  total decimal(10,2) not null,
  currency text not null default 'USD',
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date date,
  paid_at timestamptz,
  pdf_url text,
  created_at timestamptz not null default now()
);

-- 2.15 Client Progress
create table public.client_progress (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  date date not null default current_date,
  weight decimal(5,2),
  body_fat_percentage decimal(4,1),
  chest_measurement decimal(5,1),
  waist_measurement decimal(5,1),
  hips_measurement decimal(5,1),
  arms_measurement decimal(5,1),
  thighs_measurement decimal(5,1),
  measurement_unit text default 'cm' check (measurement_unit in ('cm', 'inches')),
  photos text[] default '{}',
  notes text,
  mood int check (mood >= 1 and mood <= 5),
  created_at timestamptz not null default now(),
  unique (client_id, date)
);

-- 2.16 Workout Plans
create table public.workout_plans (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  name text not null,
  description text,
  frequency_per_week int not null default 3,
  duration_weeks int not null default 4,
  start_date date not null default current_date,
  end_date date,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.17 Exercises
create table public.exercises (
  id uuid primary key default uuid_generate_v4(),
  workout_plan_id uuid not null references public.workout_plans(id) on delete cascade,
  name text not null,
  sets int not null default 3,
  reps int not null default 10,
  weight decimal(6,2),
  rest_seconds int not null default 60,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 2.18 Diet Plans
create table public.diet_plans (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  name text not null,
  description text,
  daily_calories int,
  restrictions text[] default '{}',
  start_date date not null default current_date,
  end_date date,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.19 Meals
create table public.meals (
  id uuid primary key default uuid_generate_v4(),
  diet_plan_id uuid not null references public.diet_plans(id) on delete cascade,
  name text not null,
  time_of_day time,
  calories int,
  protein_g decimal(6,1),
  carbs_g decimal(6,1),
  fats_g decimal(6,1),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 2.20 Google Calendar Tokens
create table public.google_calendar_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  access_token text not null,
  refresh_token text,
  expiry_date timestamptz,
  calendar_id text default 'primary',
  is_connected boolean not null default false,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.21 Audit Log
create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  changes jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 3. INDEXES
-- =============================================================================

create index idx_profiles_role on public.profiles(role);
create index idx_profiles_email on public.profiles(email);
create index idx_trainers_user_id on public.trainers(user_id);
create index idx_trainers_rating on public.trainers(rating desc);
create index idx_trainers_location on public.trainers(location_lat, location_lng);
create index idx_services_trainer on public.services(trainer_id);
create index idx_services_category on public.services(category);
create index idx_availability_trainer on public.availability(trainer_id);
create index idx_appointments_trainer on public.appointments(trainer_id, start_time desc);
create index idx_appointments_client on public.appointments(client_id, start_time desc);
create index idx_appointments_status on public.appointments(status);
create index idx_appointments_date on public.appointments(start_time);
create index idx_appointments_trainer_date on public.appointments(trainer_id, start_time);
create index idx_reviews_trainer on public.reviews(trainer_id);
create index idx_notifications_user on public.notifications(user_id, created_at desc);
create index idx_payments_appointment on public.payments(appointment_id);
create index idx_invoices_client on public.invoices(client_id);
create index idx_progress_client on public.client_progress(client_id, date desc);
create index idx_workout_client on public.workout_plans(client_id);
create index idx_diet_client on public.diet_plans(client_id);
create index idx_audit_logs_user on public.audit_logs(user_id, created_at desc);

-- =============================================================================
-- 4. FUNCTIONS & TRIGGERS
-- =============================================================================

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger handle_trainers_updated_at before update on public.trainers
  for each row execute function public.handle_updated_at();
create trigger handle_settings_updated_at before update on public.user_settings
  for each row execute function public.handle_updated_at();
create trigger handle_services_updated_at before update on public.services
  for each row execute function public.handle_updated_at();
create trigger handle_availability_updated_at before update on public.availability
  for each row execute function public.handle_updated_at();
create trigger handle_appointments_updated_at before update on public.appointments
  for each row execute function public.handle_updated_at();
create trigger handle_workout_plans_updated_at before update on public.workout_plans
  for each row execute function public.handle_updated_at();
create trigger handle_diet_plans_updated_at before update on public.diet_plans
  for each row execute function public.handle_updated_at();
create trigger handle_calendar_tokens_updated_at before update on public.google_calendar_tokens
  for each row execute function public.handle_updated_at();

-- Create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, auth_provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.email, 'User'),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'client'),
    case
      when new.raw_user_meta_data ->> 'provider' = 'google' then 'google'::auth_provider
      else 'email'::auth_provider
    end
  );
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update trainer rating on review
create or replace function public.update_trainer_rating()
returns trigger as $$
begin
  update public.trainers
  set
    rating = (select round(avg(rating)::decimal, 2) from public.reviews where trainer_id = new.trainer_id),
    total_reviews = (select count(*) from public.reviews where trainer_id = new.trainer_id)
  where id = new.trainer_id;
  return new;
end;
$$ language plpgsql;

create trigger on_review_inserted
  after insert or update on public.reviews
  for each row execute function public.update_trainer_rating();

-- Auto-create trainer profile from user
create or replace function public.create_trainer_profile()
returns trigger as $$
begin
  if new.role = 'trainer' then
    insert into public.trainers (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_role_trainer
  after insert or update of role on public.profiles
  for each row when (new.role = 'trainer')
  execute function public.create_trainer_profile();

-- =============================================================================
-- 5. ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.trainers enable row level security;
alter table public.trainer_social_links enable row level security;
alter table public.trainer_certifications enable row level security;
alter table public.services enable row level security;
alter table public.availability enable row level security;
alter table public.time_off enable row level security;
alter table public.appointments enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.client_progress enable row level security;
alter table public.workout_plans enable row level security;
alter table public.exercises enable row level security;
alter table public.diet_plans enable row level security;
alter table public.meals enable row level security;
alter table public.google_calendar_tokens enable row level security;
alter table public.audit_logs enable row level security;
alter table public.recurring_rules enable row level security;

-- Helper functions for RLS
create or replace function public.is_authenticated()
returns boolean as $$
  select auth.role() = 'authenticated';
$$ language sql stable;

create or replace function public.get_user_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable;

create or replace function public.is_admin()
returns boolean as $$
  select public.get_user_role() = 'admin';
$$ language sql stable;

create or replace function public.is_trainer()
returns boolean as $$
  select public.get_user_role() = 'trainer';
$$ language sql stable;

create or replace function public.is_owner(user_id uuid)
returns boolean as $$
  select auth.uid() = user_id;
$$ language sql stable;

-- Profiles: users can read/update own, admins can read/update all
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Admins can update any profile" on public.profiles
  for update using (public.is_admin());

-- Settings: owner only
create policy "Users can manage own settings" on public.user_settings
  for all using (auth.uid() = user_id);

-- Trainers: anyone can read, trainer can update own, admin can update all
create policy "Anyone can view trainers" on public.trainers
  for select using (true);
create policy "Trainers can update own profile" on public.trainers
  for update using (auth.uid() = user_id or public.is_admin());
create policy "Insert on role change" on public.trainers
  for insert with check (auth.uid() = user_id or public.is_admin());

-- Services: anyone can read, trainer can manage own
create policy "Anyone can view services" on public.services
  for select using (true);
create policy "Trainers can manage own services" on public.services
  for all using (
    auth.uid() in (select user_id from public.trainers where id = trainer_id)
    or public.is_admin()
  );

-- Availability: anyone can read, trainer can manage own
create policy "Anyone can view availability" on public.availability
  for select using (true);
create policy "Trainers can manage own availability" on public.availability
  for all using (
    auth.uid() in (select user_id from public.trainers where id = trainer_id)
    or public.is_admin()
  );

-- Appointments: involved parties and admin can read
create policy "View appointments" on public.appointments
  for select using (
    auth.uid() = client_id
    or auth.uid() in (select user_id from public.trainers where id = trainer_id)
    or public.is_admin()
  );
create policy "Clients can create appointments" on public.appointments
  for insert with check (auth.uid() = client_id);
create policy "Update own appointments" on public.appointments
  for update using (
    auth.uid() = client_id
    or auth.uid() in (select user_id from public.trainers where id = trainer_id)
    or public.is_admin()
  );

-- Notifications: user can manage own
create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

-- Reviews: anyone can read, client can create for own appointment
create policy "Anyone can read reviews" on public.reviews
  for select using (true);
create policy "Clients can review own appointments" on public.reviews
  for insert with check (auth.uid() = client_id);

-- Payments: involved parties can view
create policy "View payments" on public.payments
  for select using (
    auth.uid() = client_id
    or auth.uid() in (select user_id from public.trainers where id = trainer_id)
    or public.is_admin()
  );

-- Progress: client and trainer can manage
create policy "View progress" on public.client_progress
  for select using (
    auth.uid() = client_id
    or auth.uid() in (select user_id from public.trainers where id = trainer_id)
    or public.is_admin()
  );
create policy "Insert progress" on public.client_progress
  for insert with check (
    auth.uid() = client_id
    or auth.uid() in (select user_id from public.trainers where id = trainer_id)
  );

-- Calendar tokens: user manages own
create policy "Users can manage own calendar tokens" on public.google_calendar_tokens
  for all using (auth.uid() = user_id);
