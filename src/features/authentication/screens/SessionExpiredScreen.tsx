import { AppButton } from '@/components/common/AppButton';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { useBiometric } from '@/features/authentication/hooks/useBiometric';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SessionExpiredScreen() {
  const router = useRouter();
  const { clearSession } = useAuthStore();
  const { quickLogin } = useBiometric();
  const [error, setError] = useState('');

  useEffect(() => {
    const tryBiometricLogin = async () => {
      const result = await quickLogin();
      if (result.success) {
        router.replace('/(tabs)');
      }
    };
    tryBiometricLogin();
  }, [quickLogin, router]);

  const handleLogin = () => {
    clearSession();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScreenContainer>
      <AuthHeader
        title="Session Expired"
        subtitle="Your session has expired. Please login again."
      />

      <View style={styles.container}>
        <Text style={styles.icon}>⏰</Text>
        <Text style={styles.message}>
          Your session has expired for security reasons. Please login again to continue.
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <AppButton title="Login Again" onPress={handleLogin} variant="primary" size="large" />
        </View>
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
  message: {
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
  },
});
