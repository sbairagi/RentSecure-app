import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message || 'Invalid input');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    if (!validate()) {
      setLoading(false);
      return;
    }
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer testID="forgot-password.screen">
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email and we'll send you a reset link"
      />

      <View style={styles.form}>
        {sent ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Check your email for the reset link. If you don&apos;t see it, check your spam folder.
            </Text>
            <AppButton testID="forgot-password.back-to-login" title="Back to Login" onPress={() => router.back()} variant="primary" />
          </View>
        ) : (
          <>
            <AppInput
              testID="forgot-password.email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
            />

            <AppButton
              testID="forgot-password.submit"
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            />

            <AppButton
              testID="forgot-password.login-link"
              title="Back to Login"
              onPress={() => router.back()}
              variant="ghost"
              size="small"
            />
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: Spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
});
