/// <reference types="jest" />
/// <reference types="@testing-library/react-native" />

declare module 'react-native/Libraries/Animated/NativeAnimatedMock' {
  const content: any;
  export default content;
}

declare module '@react-native-async-storage/async-storage/jest/async-storage-mock' {
  const content: any;
  export default content;
}

declare module 'react-native-reanimated/mock' {
  const content: any;
  export default content;
}
