import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const { resetPassword } = useAuth();
  const [form, setForm] = useState<ResetPasswordForm>({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const result = resetPasswordSchema.safeParse(form);
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
      await resetPassword({
        token: typeof params.token === 'string' ? params.token : '',
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer testID="reset-password.screen">
      <AuthHeader title="Reset Password" subtitle="Create a new password" />

      <View style={styles.form}>
        {success ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Password reset successful! Please login with your new password.
            </Text>
            <AppButton
              testID="reset-password.login-link"
              title="Go to Login"
              onPress={() => router.replace('/(auth)/login')}
              variant="primary"
            />
          </View>
        ) : (
          <>
            <AppInput
              testID="reset-password.password"
              label="New Password"
              placeholder="Enter new password"
              value={form.password}
              onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
              secureTextEntry
              error={error}
            />
            <AppInput
              testID="reset-password.confirmPassword"
              label="Confirm Password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChangeText={(text) => setForm((prev) => ({ ...prev, confirmPassword: text }))}
              secureTextEntry
            />
            <AppButton
              testID="reset-password.submit"
              title="Reset Password"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
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
