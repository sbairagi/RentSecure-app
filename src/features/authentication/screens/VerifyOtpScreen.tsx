import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { authApi } from '@/services/auth/auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d+$/, 'OTP must be numeric');

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; email?: string }>();
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<'owner' | 'renter'>('renter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const validation = otpSchema.safeParse(otp);
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Invalid OTP');
      setLoading(false);
      return;
    }
    try {
      const phone = typeof params.phone === 'string' ? params.phone : '';
      await verifyOtp(phone, otp, role);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await authApi.sendOtp(params.phone as string);
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <AuthHeader
        title="Verify OTP"
        subtitle={`Enter the 6-digit code sent to ${params.phone || params.email || 'your phone'}`}
      />

      <View style={styles.form}>
        <AppInput
          label="OTP"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          error={error}
          autoFocus
        />

        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>I am an:</Text>
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

        <AppButton title="Verify OTP" onPress={handleSubmit} loading={loading} disabled={loading} />

        <View style={styles.resendContainer}>
          {countdown > 0 ? (
            <Text style={styles.countdown}>Resend OTP in {countdown}s</Text>
          ) : (
            <AppButton
              title="Resend OTP"
              onPress={handleResendOtp}
              loading={resendLoading}
              variant="ghost"
              size="small"
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  resendContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  countdown: {
    fontSize: 14,
    opacity: 0.6,
  },
});
