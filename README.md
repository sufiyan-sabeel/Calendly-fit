# 🏋️ Calendy Fit

> Premium Appointment Scheduling & Client Management Platform — Powered by Supabase

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![Expo](https://img.shields.io/badge/Expo-51-black?style=flat-square&logo=expo)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Supabase-2.45-3FCF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

---

## 📋 Overview

**Calendy Fit** is a full-stack, production-ready scheduling and client management platform for fitness professionals — personal trainers, nutritionists, physiotherapists, yoga instructors, gyms, and wellness coaches.

### Architecture

```
calendy-fit/                  # Monorepo (pnpm + Turborepo)
├── apps/
│   ├── mobile/               # Expo/React Native app (iOS + Android)
│   └── web/                  # Next.js 15 web app
├── packages/
│   ├── api/                  # Supabase client + Google integrations
│   ├── config/               # Shared environment & constants
│   ├── hooks/                # Shared React hooks (useAuth, etc.)
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Date, format, validation utilities
└── supabase/
    ├── schema.sql            # Complete PostgreSQL schema
    └── policies/             # Row Level Security policies
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | Expo SDK 51, React Native 0.74, NativeWind, Reanimated |
| **Web** | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| **Database** | PostgreSQL (Supabase), Row Level Security |
| **Auth** | Supabase Auth (Email/Password, Google OAuth) |
| **Storage** | Supabase Storage (avatars, progress photos, certificates) |
| **Realtime** | Supabase Realtime (appointments, notifications, calendar) |
| **State** | Zustand, TanStack React Query |
| **Google** | Calendar API, Maps API, People API, Drive API |

### Features
- ✅ Smart appointment scheduling with availability management
- ✅ Google Calendar two-way sync with Meet link generation
- ✅ Client management with progress tracking & workout plans
- ✅ Role-based dashboards (Client, Trainer, Admin)
- ✅ Supabase Row Level Security
- ✅ Real-time notifications & updates
- ✅ Premium Black AMOLED + Glassmorphism UI
- ✅ Offline-first architecture

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start mobile app
pnpm mobile

# Start web app
pnpm web
```

## 🐙 Supabase Setup

1. Create a Supabase project: https://supabase.com
2. Run the schema: `supabase/schema.sql` in SQL Editor
3. Enable Google OAuth in Auth > Providers
4. Create storage buckets: avatars, trainer-certificates, progress-photos, documents, booking-files, service-images
5. Copy `.env.example` to `.env` and fill in values

## 📱 Mobile (Expo)

```bash
cd apps/mobile
cp .env.example .env
npx expo start
```

## 🌐 Web (Next.js)

```bash
cd apps/web
cp .env.example .env.local
pnpm dev
```

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [API Integration Guide](./docs/API_GUIDE.md)
