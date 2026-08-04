import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { authApi } from '@/services/auth/auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

const createPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type CreatePasswordForm = z.infer<typeof createPasswordSchema>;

export default function CreatePasswordScreen() {
  const router = useRouter();
  const [form, setForm] = useState<CreatePasswordForm>({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (): boolean => {
    const result = createPasswordSchema.safeParse(form);
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
      await authApi.changePassword({
        currentPassword: '',
        newPassword: form.password,
        confirmPassword: form.confirmPassword,
      });
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Failed to create password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <AuthHeader title="Create Password" subtitle="Set a password for your account" />

      <View style={styles.form}>
        <AppInput
          label="Password"
          placeholder="Create a password"
          value={form.password}
          onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
          secureTextEntry
          error={error}
        />
        <AppInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChangeText={(text) => setForm((prev) => ({ ...prev, confirmPassword: text }))}
          secureTextEntry
        />
        <AppButton
          title="Create Password"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: Spacing.lg,
  },
});
