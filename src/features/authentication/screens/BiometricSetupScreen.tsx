import { AppButton } from '@/components/common/AppButton';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { AUTH_ERROR_MESSAGES } from '@/constants/auth.constants';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { useBiometric } from '@/features/authentication/hooks/useBiometric';
import { authApi } from '@/services/auth/auth';
import { secureStorage } from '@/services/storage/secureStorage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BiometricSetupScreen() {
  const router = useRouter();
  const {
    isBiometricAvailable,
    isBiometricEnrolled,
    isBiometricEnabled,
    enableBiometric,
    disableBiometric,
    authenticate,
  } = useBiometric();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const checkBiometricStatus = async () => {
    const enabled = await secureStorage.getBiometricEnabled();
    if (enabled) {
      setStatus('success');
    }
  };

  useEffect(() => {
    let cancelled = false;
    setTimeout(() => {
      checkBiometricStatus().then(() => {
        if (cancelled) return;
      });
    }, 0);
    return () => {
      cancelled = true;
    };
  }, []);

  const handleEnableBiometric = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await authenticate();
      if (result.success) {
        await enableBiometric();
        await authApi.setupBiometric();
        setStatus('success');
      } else {
        setErrorMessage(result.error || AUTH_ERROR_MESSAGES.BIOMETRIC_FAILED);
        setStatus('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to setup biometric');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableBiometric = async () => {
    setLoading(true);
    try {
      await disableBiometric();
      await authApi.disableBiometric();
      setStatus('idle');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to disable biometric');
    } finally {
      setLoading(false);
    }
  };

  if (!isBiometricAvailable) {
    return (
      <ScreenContainer>
        <AuthHeader title="Biometric Login" subtitle="Set up biometric authentication" />
        <View style={styles.container}>
          <Text style={styles.errorText}>{AUTH_ERROR_MESSAGES.BIOMETRIC_NOT_AVAILABLE}</Text>
          <AppButton title="Go Back" onPress={() => router.back()} variant="outline" />
        </View>
      </ScreenContainer>
    );
  }

  if (!isBiometricEnrolled) {
    return (
      <ScreenContainer>
        <AuthHeader title="Biometric Login" subtitle="Set up biometric authentication" />
        <View style={styles.container}>
          <Text style={styles.errorText}>{AUTH_ERROR_MESSAGES.BIOMETRIC_NOT_ENROLLED}</Text>
          <AppButton title="Go Back" onPress={() => router.back()} variant="outline" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AuthHeader
        title="Biometric Login"
        subtitle="Use Face ID or Fingerprint for quick and secure login"
      />

      <View style={styles.container}>
        <Text style={styles.icon}>🔐</Text>
        <Text style={styles.statusText}>
          {status === 'success'
            ? 'Biometric authentication is enabled'
            : 'Enable biometric authentication for faster login'}
        </Text>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <View style={styles.buttonContainer}>
          {status === 'success' ? (
            <AppButton
              title="Disable Biometric"
              onPress={handleDisableBiometric}
              loading={loading}
              variant="outline"
            />
          ) : (
            <AppButton title="Enable Biometric" onPress={handleEnableBiometric} loading={loading} />
          )}
        </View>

        <AppButton
          title="Skip for Now"
          onPress={() => router.back()}
          variant="ghost"
          size="small"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: Spacing.md,
  },
});
