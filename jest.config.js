/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  setupFilesAfterEnv: ['<rootDir>/src/features/renters/tests/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-mmkv|@react-native-async-storage|@expo|expo|expo-modules-core|expo-constants|expo-device|expo-local-authentication|expo-secure-store|expo-splash-screen|expo-status-bar|expo-symbols|expo-system-ui|expo-web-browser|expo-linking|expo-font|expo-image|expo-glass-effect|expo-haptics|expo-build-properties|expo-router|@expo/ui|react-native-flash-message|react-native-paper|react-native-svg|react-native-web|react-native-worklets|react-native-gesture-handler|@tanstack|zustand|axios|zod|i18next|react-i18next|react-hook-form|eslint|prettier|@testing-library|@babel)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/features/renters/**/*.{ts,tsx}',
    '!src/features/renters/tests/**',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = config;
