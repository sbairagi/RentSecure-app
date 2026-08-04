import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { authApi } from '@/services/auth/auth';
import { useAuthStore } from '@/store/authStore';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<'owner' | 'renter'>('owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = typeof params.phone === 'string' ? params.phone : '';

  const handleVerifyOtp = async () => {
    setError('');

    if (!phone) {
      setError('Phone number is missing');
      return;
    }
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyOtp(phone, otp, role);
      await login(response.user, response.accessToken, response.refreshToken);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Verify OTP
        </ThemedText>
        <ThemedText style={styles.subtitle}>Enter the OTP sent to your phone</ThemedText>
      </ThemedView>

      <View style={styles.form}>
        <AppInput
          label="OTP"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          error={error}
        />

        <View style={styles.roleContainer}>
          <ThemedText style={styles.roleLabel}>I am an:</ThemedText>
          <View style={styles.roleButtons}>
            <AppButton
              title="Owner"
              variant={role === 'owner' ? 'primary' : 'outline'}
              onPress={() => setRole('owner')}
              style={styles.roleButton}
            />
            <AppButton
              title="Renter"
              variant={role === 'renter' ? 'primary' : 'outline'}
              onPress={() => setRole('renter')}
              style={styles.roleButton}
            />
          </View>
        </View>

        <AppButton title="Verify" onPress={handleVerifyOtp} loading={loading} disabled={loading} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    marginTop: Spacing.lg,
  },
  roleContainer: {
    marginBottom: Spacing.lg,
  },
  roleLabel: {
    marginBottom: Spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  roleButton: {
    flex: 1,
  },
});
