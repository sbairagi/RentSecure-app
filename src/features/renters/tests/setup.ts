// @ts-nocheck
import '@testing-library/react-native/extend-expect';
import 'react-native/Libraries/Animated/NativeAnimatedHelper';

jest.mock('react-native/Libraries/Animated/NativeAnimatedMock');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('expo-modules-core', () => ({
  EventEmitter: jest.fn(),
  NativeModule: jest.fn(),
  Constants: {
    expoConfig: {},
    sessionId: 'test-session-id',
  },
}));

jest.mock('expo-constants', () => ({
  Constants: {
    expoConfig: {},
    sessionId: 'test-session-id',
    platform: { ios: null, android: null, web: null },
  },
}));

jest.mock('@/services/api/apiClient', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

global.fetch = jest.fn();
