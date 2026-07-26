# Calendy Fit - API Integration Guide

## Supabase Setup

1. **Create a Supabase project** at https://supabase.com
2. **Run the schema** (`supabase/schema.sql`) in the SQL Editor
3. **Enable Auth providers**:
   - Go to Authentication → Providers
   - Enable Email/Password
   - Enable Google → Add OAuth client ID from Google Cloud Console
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
- Add scopes: `openid`, `email`, `profile`, `calendar`, `calendar.events`, `contacts.readonly`, `drive.file`

### 3. OAuth Credentials (Web)
- Create OAuth 2.0 Client ID → Web application
- Authorized redirect URIs:
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.com/auth/callback`

### 4. OAuth Credentials (Android)
- Create OAuth 2.0 Client ID → Android
- Package name: `com.calendyfit.app`
- SHA-1 fingerprint: Get from `npx expo credentials:manager`

### 5. OAuth Credentials (iOS)
- Create OAuth 2.0 Client ID → iOS
- Bundle ID: `com.calendyfit.app`

### 6. Enable APIs
- Google Calendar API
- Google People API (contacts)
- Google Maps SDK (Android & iOS)
- Places API
- Directions API
- Google Drive API

### 7. API Keys
- Create API Key → Restrict to: Calendar API, Maps API, People API, Drive API

## Required OAuth Scopes

| Scope | Purpose |
|-------|---------|
| `openid` | OpenID Connect |
| `email` | Read user email |
| `profile` | Read user name, avatar |
| `https://www.googleapis.com/auth/calendar` | Calendar event management |
| `https://www.googleapis.com/auth/calendar.events` | Event-level CRUD |
| `https://www.googleapis.com/auth/contacts.readonly` | Import contacts |
| `https://www.googleapis.com/auth/drive.file` | Export files to Drive |

## Environment Variables

### Mobile (apps/mobile/.env)
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_CALENDAR_API_KEY=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_SUPABASE_REDIRECT_URL=calendyfit://auth/callback
```

### Web (apps/web/.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
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
