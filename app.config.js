module.exports = {
  expo: {
    name: 'SecureNest',
    slug: 'rentsecure-app',
    scheme: 'rentsecureapp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#4f46e5',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.securenest.app',
      buildNumber: '1',
      deploymentTarget: '16.4',
      associatedDomains: ['applinks:app.rentsecureapp.com'],
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#4f46e5',
      },
      package: 'com.securenest.app',
      versionCode: 1,
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'rentsecureapp',
              host: 'app.rentsecureapp.com',
              pathPrefix: '/payment',
            },
            {
              scheme: 'rentsecureapp',
              host: 'app.rentsecureapp.com',
              pathPrefix: '/invitation',
            },
            {
              scheme: 'rentsecureapp',
              host: 'app.rentsecureapp.com',
              pathPrefix: '/agreement',
            },
            {
              scheme: 'rentsecureapp',
              host: 'app.rentsecureapp.com',
              pathPrefix: '/rent-record',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-router',
      'expo-local-authentication',
      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 23,
            compileSdkVersion: 35,
            targetSdkVersion: 35,
          },
          ios: {
            deploymentTarget: '16.4',
          },
        },
      ],
    ],
    extra: {
      API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',
      API_TIMEOUT: 30000,
      API_RETRY_COUNT: 3,
      APP_NAME: 'SecureNest',
      APP_VERSION: '1.0.0',
      APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
      SENTRY_DSN: '',
      ENABLE_ANALYTICS: true,
      ENABLE_CRASH_REPORTING: true,
      ENABLE_PUSH_NOTIFICATIONS: true,
      GOOGLE_MAPS_API_KEY: '',
      APP_SCHEME: 'rentsecureapp',
      DEEP_LINK_HOST: 'app.rentsecureapp.com',
    },
  },
};
