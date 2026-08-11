// ─────────────────────────────────────────────────────────────────────────────
// RentSecure – Expo app configuration (SDK 57)
//
// This is the single source of truth for all Expo / EAS settings.
// app.json exists as a static JSON fallback; app.config.js overrides it at
// runtime with dynamic values from .env and computed fields.
//
// Asset layout (all files in assets/):
//   icon.png              → 1024×1024  App Store / Play Store listing icon
//   adaptive-icon.png     → 512×512    Android adaptive-icon foreground layer
//   adaptive-background.png → 512×512  Android adaptive-icon background layer
//   monochrome-icon.png   → 512×512    Android 13+ themed icon
//   splash.png            → 1284×2778   Full-screen launch background
//   splash-icon.png       → 512×512    Centred logo on splash (expo-splash-screen)
//   favicon.png           → 48×48       Web favicon
//   notification-icon.png → 48×48       Android notification shade icon
//   logo.png / logo-dark.png / logo-light.png → In-app branding logos
// ─────────────────────────────────────────────────────────────────────────────
const IS_DEV = process.env.EXPO_PUBLIC_APP_ENV !== 'production';

module.exports = {
  expo: {
    // ── Identity ────────────────────────────────────────────────────────────
    name: 'RentSecure',                  // Human-readable app name (shown on device)
    slug: 'rentsecure',                  // URL-safe identifier; used in Expo dashboard
    owner: 'rentsecure',                 // Required for EAS Build / Submissions
    version: '1.0.0',                    // Semver app version (increment per store release)
    ios: {
      bundleIdentifier: 'com.rentsecure.app',
      buildNumber: '1',
      deploymentTarget: '16.4',
      supportsTablet: true,
      associatedDomains: ['applinks:app.rentsecureapp.com'],
      // expo-icon format (iOS 17+ / SDK 57 vector icon asset)
      icon: './assets/expo.icon',
      // New Architecture is opt-in per-target in Expo SDK 57
      newArchEnabled: true,
      infoPlist: {
        NSCameraUsageDescription: 'RentSecure needs camera access to scan documents and verify identities.',
        NSPhotoLibraryUsageDescription: 'RentSecure needs photo library access to upload property and document images.',
        NSLocationWhenInUseUsageDescription: 'RentSecure uses your location to show nearby properties.',
        NSFaceIDUsageDescription: 'RentSecure uses Face ID to secure your account.',
        NSUserTrackingUsageDescription: 'RentSecure uses tracking data to personalise your experience.',
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.rentsecure.app',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundImage: './assets/adaptive-background.png',
        backgroundColor: '#208AEF',
        monochromeImage: './assets/monochrome-icon.png',  // Android 13+ themed icon
      },
      notificationIcon: './assets/notification-icon.png',
      predictiveBackGestureEnabled: false,
      // EAS Build: compile / target SDK (also set in expo-build-properties plugin below)
      // Per-app language preferences (Android 13+)
      // Intent filters for universal links are also declared in linking.schemes
      // See: https://docs.expo.dev/versions/v57.0.0/sdk/linking/
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            { scheme: 'rentsecure', host: 'app.rentsecureapp.com', pathPrefix: '/payment' },
            { scheme: 'rentsecure', host: 'app.rentsecureapp.com', pathPrefix: '/invitation' },
            { scheme: 'rentsecure', host: 'app.rentsecure.com', pathPrefix: '/agreement' },
            { scheme: 'rentsecure', host: 'app.rentsecureapp.com', pathPrefix: '/rent-record' },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
      googleServicesFile: IS_DEV
        ? undefined
        : './android/app/google-services.json', // Set by EAS Build secret
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'USE_FINGERPRINT',
        'USE_BIOMETRIC',
        'INTERNET',
        'ACCESS_NETWORK_STATE',
        'VIBRATE',
        'RECEIVE_BOOT_COMPLETED',
        'POST_NOTIFICATIONS',
        'SCHEDULE_EXACT_ALARM',
      ],
    },

    // ── Splash screen ────────────────────────────────────────────────────────
    // splash (top-level) is used by expo-splash-screen plugin for native launch
    // splash-icon is the centred image; splash.png is the background colour fill
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#208AEF',
    },

    // ── Icon ────────────────────────────────────────────────────────────────
    // Top-level icon: 1024×1024 PNG used for app store listings and home screen
    icon: './assets/icon.png',

    // ── Appearance ───────────────────────────────────────────────────────────
    userInterfaceStyle: 'automatic',  // Respects system dark/light mode

    // ── Deep linking ────────────────────────────────────────────────────────
    scheme: 'rentsecure',             // Custom URL scheme: rentsecure://<path>
    // Full deep-link prefixes (handled in src/navigation/deepLinking.ts)
    //   rentsecure://dashboard        → custom scheme
    //   https://app.rentsecureapp.com/dashboard → universal link (iOS/Android)

    // ── Web configuration ────────────────────────────────────────────────────
    web: {
      output: 'static',              // Static HTML export for production hosting
      favicon: './assets/favicon.png',
      bundler: 'metro',
      // web.expo-icon: true,  // Enable if using expo-icon vector assets on web
    },

    // ── Plugins ─────────────────────────────────────────────────────────────
    plugins: [
      // Expo Router – file-based navigation (required)
      'expo-router',
      // Secure storage for tokens and sensitive data
      'expo-secure-store',
      // Biometric / device authentication (Face ID, Touch ID, fingerprint)
      'expo-local-authentication',
      // Push notifications (APNs on iOS, FCM on Android)
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#208AEF',
          sounds: [],
          mode: 'production',
          enableBackgroundRemoteNotifications: true,
        },
      ],
      // Splash screen native module
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          image: './assets/splash-icon.png',
          imageWidth: 76,
          resizeMode: 'contain',
        },
      ],
      // Android SDK version pinning (minSdk 23, target 35)
      // iOS deployment target is declared above in ios.deploymentTarget
      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 23,
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: '35.0.0',
          },
          ios: {
            deploymentTarget: '16.4',
            useFrameworks: 'static',
          },
        },
      ],
    ],

    // ── Experiments (SDK 57 stable features) ────────────────────────────────
    experiments: {
      typedRoutes: true,           // Expo Router typed routes (stable in SDK 57)
      reactCompiler: true,         // React Compiler (opt-in in SDK 57)
    },

    // ── Updates (Over-The-Air) ──────────────────────────────────────────────
    updates: {
      url: 'https://u.expo.dev/rentsecure', // Replace with your EAS Update URL
      fallbackToCacheTimeout: 0,    // Show splash until the latest bundle is fetched
      checkAutomatically: 'ON_ERROR_RECOVERY', // Check for updates after a crash / error
    },

    // ── Runtime version ─────────────────────────────────────────────────────
    // Using expo-runtime-version strategy means the runtime version is derived
    // from the Expo SDK version. Increment this manually to force an OTA update
    // when a native dependency changes without bumping the SDK.
    runtimeVersion: {
      policy: 'sdkVersion',
    },

    // ── Extra (environment variables baked into the binary at build time) ────
    extra: {
      // API configuration – change EXPO_PUBLIC_API_URL in .env to switch backends.
      // Development: use your Mac's LAN IP so Expo Go on iPhone can reach it.
      //   Example: EXPO_PUBLIC_API_URL=http://192.168.1.4:8000/api
      API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.4:8000/api',
      API_TIMEOUT: process.env.EXPO_PUBLIC_API_TIMEOUT || 30000,
      API_RETRY_COUNT: process.env.EXPO_PUBLIC_API_RETRY_COUNT || 3,
      APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'RentSecure',
      APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
      APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
      SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
      ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
      ENABLE_CRASH_REPORTING: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === 'true',
      ENABLE_PUSH_NOTIFICATIONS: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
      GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME || 'rentsecure',
      DEEP_LINK_HOST: 'app.rentsecureapp.com',
      EAS_PROJECT_ID: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || '',
    },
  },
};
