# Calendy Fit - Deployment Guide

## Mobile App (Expo + EAS Build)

### Prerequisites
- EAS CLI: `npm install -g eas-cli`
- Expo account: `eas login`
- Android: Java 17, Android Studio (for local builds)
- iOS: Xcode 15+ (macOS only)

### Build for Production

```bash
cd apps/mobile

# Android
eas build -p android --profile production

# iOS
eas build -p ios --profile production
```

### Google Play Store
1. Create app listing in Google Play Console
2. Upload the AAB from `eas build`
3. Complete store listing (screenshots, description, privacy policy)

### Apple App Store
1. Create app in App Store Connect
2. Upload IPA via `eas submit -p ios`
3. Complete TestFlight and App Review

## Web App (Next.js + Vercel)

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/web
vercel --prod
```

Or connect the GitHub repo to Vercel for automatic deployments.

### Environment Variables (Vercel)
Add these in Vercel dashboard → Project Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## Supabase Production Checklist

- [ ] Enable Row Level Security on all tables
- [ ] Set up database backups (point-in-time recovery)
- [ ] Configure custom SMTP for auth emails
- [ ] Set up rate limiting
- [ ] Enable SSL enforcement
- [ ] Monitor database performance
- [ ] Set up real-time for production (separate pooler)

## Pre-Launch Checklist

- [ ] Firebase removed, Supabase fully configured
- [ ] Environment variables set in all platforms
- [ ] Google OAuth consent screen verified
- [ ] Privacy Policy and Terms of Service published
- [ ] App icons and screenshots ready
- [ ] Deep linking configured for mobile
- [ ] Crash reporting enabled (Sentry)
- [ ] Load testing completed
- [ ] Analytics dashboard configured
