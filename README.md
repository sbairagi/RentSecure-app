# SecureNest Mobile App

Enterprise-grade React Native mobile application built with Expo SDK 57, Expo Router, and TypeScript for the SecureNest property management platform.

## Features

- **Feature-based Architecture**: Scalable folder structure supporting 100+ screens
- **Multiple User Roles**: Owner, Caretaker, Renter, Admin
- **Internationalization**: English and Hindi support with i18next
- **State Management**: Zustand for global state
- **API Layer**: Axios with JWT auth, refresh tokens, retry logic, and network detection
- **Secure Storage**: Expo Secure Store for sensitive data
- **Offline Ready**: MMKV caching for offline support
- **Modern UI**: React Native Paper, Reanimated, Gesture Handler

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Expo CLI
- iOS Simulator / Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Project Structure

```
src/
├── app/                    # Expo Router screens and layouts
├── assets/                 # Images, fonts, icons
├── components/             # Reusable UI components
│   ├── common/            # Base components (AppButton, AppText, etc.)
│   ├── ui/                # UI components (Avatar, Badge, etc.)
│   ├── forms/             # Form components
│   └── charts/            # Chart components
├── config/                # App configuration
├── constants/             # Theme and shared constants
├── hooks/                 # Custom React hooks
├── layouts/               # Shared layout components
├── localization/          # i18next translations (en, hi)
├── navigation/            # Navigation configuration
├── providers/             # Context providers (Theme, Query, Storage)
├── services/              # API, Auth, Storage, Notifications
├── features/              # Feature modules (authentication, dashboard, etc.)
├── store/                 # Zustand global stores
├── theme/                 # Theme system (light/dark)
├── types/                 # TypeScript type definitions
├── utils/                 # Utility helpers
└── validations/           # Zod validation schemas
```

## Tech Stack

- **Framework**: React Native with Expo SDK 57
- **Navigation**: Expo Router (file-based)
- **Language**: TypeScript
- **State Management**: Zustand
- **API Client**: Axios with interceptors
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form + Zod
- **Styling**: React Native Paper + Custom Theme
- **Animations**: Reanimated 3 + Gesture Handler
- **Storage**: Expo Secure Store + MMKV
- **Notifications**: Expo Notifications
- **Internationalization**: i18next (EN, HI)

## Scripts

```bash
npm start          # Start Expo dev server
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors
npm run typecheck  # Run TypeScript checks
npm run prettier   # Format code with Prettier
```

## Environment Variables

Create `.env` file based on `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_SENTRY_DSN=
```

## Architecture Principles

- **Clean Architecture**: Separation of concerns with clear module boundaries
- **SOLID Principles**: Single responsibility, dependency inversion
- **DRY/KISS**: Reusable components, minimal complexity
- **Scalability**: Feature-based structure for 100+ screens
- **Offline Ready**: MMKV caching with network detection
- **Security**: Secure storage, JWT refresh tokens, HTTPS only

## User Roles

1. **Owner**: Full property management access
2. **Caretaker**: Property maintenance and renter management
3. **Renter**: View agreements, make payments, submit requests
4. **Admin**: Platform administration and oversight

## License

Proprietary - SecureNest Platform
