declare module 'expo-local-authentication' {
  export enum AuthenticationType {
    FINGERPRINT = 1,
    FACIAL_RECOGNITION = 2,
    IRIS = 3,
  }

  export interface LocalAuthenticationResult {
    success: boolean;
    error?: string;
  }

  export interface BiometricOptions {
    title?: string;
    subtitle?: string;
    description?: string;
    cancelLabel?: string;
    fallbackLabel?: string;
    disableDeviceFallback?: boolean;
    authenticationType?: AuthenticationType;
  }

  export function hasHardwareAsync(): Promise<boolean>;
  export function isEnrolledAsync(): Promise<boolean>;
  export function supportedAuthenticationTypesAsync(): Promise<AuthenticationType[]>;
  export function authenticateAsync(options: BiometricOptions): Promise<LocalAuthenticationResult>;
}
