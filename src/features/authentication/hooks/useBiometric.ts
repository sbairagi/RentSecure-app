import { AUTH_ERROR_MESSAGES, BIOMETRIC_OPTIONS } from '@/constants/auth.constants';
import { secureStorage } from '@/services/storage/secureStorage';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

type BiometricResult = {
  success: boolean;
  error?: string;
};

type BiometricType = 'faceid' | 'fingerprint' | 'none';

const loadBiometricModule = async () => {
  if (Platform.OS === 'web') return null;
  try {
    // eslint-disable-next-line import/no-unresolved
    return await import('expo-local-authentication');
  } catch {
    return null;
  }
};

export const useBiometric = () => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  const checkBiometricAvailability = useCallback(async () => {
    try {
      const module = await loadBiometricModule();
      if (!module) {
        setIsBiometricAvailable(false);
        return;
      }
      const compatible = await module.hasHardwareAsync();
      setIsBiometricAvailable(compatible);
      if (compatible) {
        const enrolled = await module.isEnrolledAsync();
        setIsBiometricEnrolled(enrolled);
        const types = await module.supportedAuthenticationTypesAsync();
        if (types.includes(module.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('faceid');
        } else if (types.includes(module.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        }
        const enabled = await secureStorage.getBiometricEnabled();
        setIsBiometricEnabled(!!enabled);
      }
    } catch (error) {
      console.error('Biometric availability check failed:', error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkBiometricAvailability();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkBiometricAvailability]);

  const authenticate = useCallback(async (): Promise<BiometricResult> => {
    if (!isBiometricAvailable || !isBiometricEnrolled) {
      return { success: false, error: AUTH_ERROR_MESSAGES.BIOMETRIC_NOT_AVAILABLE };
    }

    setIsLoading(true);
    try {
      const module = await loadBiometricModule();
      if (!module) {
        return { success: false, error: AUTH_ERROR_MESSAGES.BIOMETRIC_NOT_AVAILABLE };
      }

      const result = await module.authenticateAsync({
        ...BIOMETRIC_OPTIONS,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        authenticationType:
          biometricType === 'faceid'
            ? module.AuthenticationType.FACIAL_RECOGNITION
            : module.AuthenticationType.FINGERPRINT,
      });

      setIsLoading(false);
      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error || AUTH_ERROR_MESSAGES.BIOMETRIC_FAILED };
    } catch (error: any) {
      setIsLoading(false);
      return { success: false, error: error.message || AUTH_ERROR_MESSAGES.BIOMETRIC_FAILED };
    }
  }, [isBiometricAvailable, isBiometricEnrolled, biometricType]);

  const enableBiometric = useCallback(async () => {
    try {
      await secureStorage.setBiometricEnabled('true');
      setIsBiometricEnabled(true);
      return true;
    } catch (error) {
      console.error('Failed to enable biometric:', error);
      return false;
    }
  }, []);

  const disableBiometric = useCallback(async () => {
    try {
      await secureStorage.setBiometricEnabled('');
      setIsBiometricEnabled(false);
      return true;
    } catch (error) {
      console.error('Failed to disable biometric:', error);
      return false;
    }
  }, []);

  const quickLogin = useCallback(async (): Promise<BiometricResult> => {
    if (!isBiometricEnabled) {
      return { success: false, error: 'Biometric is not enabled' };
    }
    return authenticate();
  }, [authenticate, isBiometricEnabled]);

  return {
    isBiometricAvailable,
    isBiometricEnrolled,
    biometricType,
    isLoading,
    isBiometricEnabled,
    authenticate,
    enableBiometric,
    disableBiometric,
    quickLogin,
    refreshAvailability: checkBiometricAvailability,
  };
};
