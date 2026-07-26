# Calendy Fit - API Integration Guide

## ✅ Completed Integrations

| Service | Status |
|---------|--------|
| Supabase | ✅ Configured |
| Google OAuth | ✅ Configured |
| Google Calendar API | ✅ Enabled |
| Google Maps | ⏳ Pending |
| Google Contacts | ⏳ Pending |
| Google Drive | ⏳ Pending |
| Stripe | ⏳ Optional |

---

## Supabase Setup

1. **Create a Supabase project** at https://supabase.com
2. **Run the schema** (`supabase/schema.sql`) in the SQL Editor
3. **Enable Auth providers**:
   - Go to Authentication → Providers
   - Enable Email/Password
   - Enable Google → Enter:
     - Client ID: `664719074795-41pajk4hb7c001sld26hqpjgus94h4bi.apps.googleusercontent.com`
     - Client Secret: [provided in Supabase Dashboard only]
4. **Create Storage buckets**:
   - `avatars` (public read, authenticated write)
   - `trainer-certificates` (authenticated read/write)
   - `progress-photos` (authenticated read/write)
   - `documents` (authenticated read/write)
   - `booking-files` (authenticated read/write)
   - `service-images` (public read, trainer write)
5. **Get API keys**: Project Settings → API → Project URL, anon key, service_role key

## Google Cloud Console Setup

### 1. Create Project
- Go to [console.cloud.google.com](https://console.cloud.google.com)
- Create project: `Calendy Fit`

### 2. OAuth Consent Screen
- APIs & Services → OAuth consent screen
- User Type: External
- Add scopes:
  ```
  openid, email, profile
  https://www.googleapis.com/auth/calendar
  https://www.googleapis.com/auth/calendar.events
  https://www.googleapis.com/auth/contacts.readonly   (optional)
  https://www.googleapis.com/auth/drive.file           (optional)
  ```

### 3. OAuth Credentials (Web)
- Create OAuth 2.0 Client ID → Web application
- **Client ID**: `664719074795-41pajk4hb7c001sld26hqpjgus94h4bi.apps.googleusercontent.com`
- Authorized JavaScript origins:
  - `http://localhost:3000`
  - `https://sufiyan-sabeel.github.io`
- Authorized redirect URIs:
  - `http://localhost:3000/auth/callback`
  - `https://sufiyan-sabeel.github.io/Calendly-fit/auth/callback`
  - `https://elevwhalcpkzjpeftoai.supabase.co/auth/v1/callback`

### 4. Enable APIs
- ✅ Google Calendar API — [Enabled](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com)
- ⏳ Google Maps SDK (when configuring Maps)
- ⏳ Places API (when configuring Maps)
- ⏳ Directions API (when configuring Maps)
- ⏳ Google People API (when configuring Contacts)
- ⏳ Google Drive API (when configuring Drive)

### 5. API Keys
- Calendar API Key: Not required (uses OAuth)
- Maps API Key: [Pending]

## Required OAuth Scopes

| Scope | Purpose | Required |
|-------|---------|----------|
| `openid` | OpenID Connect | ✅ Yes |
| `email` | Read user email | ✅ Yes |
| `profile` | Read user name, avatar | ✅ Yes |
| `https://www.googleapis.com/auth/calendar` | Calendar event management | ✅ Yes |
| `https://www.googleapis.com/auth/calendar.events` | Event-level CRUD | ✅ Yes |
| `https://www.googleapis.com/auth/contacts.readonly` | Import contacts | ⚠️ Optional |
| `https://www.googleapis.com/auth/drive.file` | Export files to Drive | ⚠️ Optional |

## Environment Variables

### Mobile (apps/mobile/.env)
```
EXPO_PUBLIC_SUPABASE_URL=https://elevwhalcpkzjpeftoai.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_BwzBRjsTHNijFaTZGsHuMg_ykfKbw8H
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_CALENDAR_API_KEY=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_SUPABASE_REDIRECT_URL=calendyfit://auth/callback
EXPO_PUBLIC_APP_NAME=Calendy Fit
```

### Web (apps/web/.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://elevwhalcpkzjpeftoai.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_BwzBRjsTHNijFaTZGsHuMg_ykfKbw8H
NEXT_PUBLIC_GOOGLE_CLIENT_ID=664719074795-41pajk4hb7c001sld26hqpjgus94h4bi.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_REDIRECT_URL=http://localhost:3000/auth/callback
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
NEXT_PUBLIC_APP_NAME=Calendy Fit
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Official Documentation

- Supabase: https://supabase.com/docs
- Google Calendar API: https://developers.google.com/calendar
- Google Identity: https://developers.google.com/identity
- Google People API: https://developers.google.com/people
- Google Maps Platform: https://developers.google.com/maps
- Google Drive API: https://developers.google.com/drive
- Next.js: https://nextjs.org/docs
- Expo: https://docs.expo.dev
