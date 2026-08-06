import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['property_owner', 'renter', 'caretaker']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'renter',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (): boolean => {
    const result = signupSchema.safeParse(form);
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
      await register(form);
      router.replace('/(drawer)/(tabs)/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScreenContainer>
      <AuthHeader title="Create Account" subtitle="Join SecureNest today" />

      <View style={styles.form}>
        <AppInput
          label="First Name"
          placeholder="Enter your first name"
          value={form.firstName}
          onChangeText={(text) => updateField('firstName', text)}
        />
        <AppInput
          label="Last Name"
          placeholder="Enter your last name"
          value={form.lastName}
          onChangeText={(text) => updateField('lastName', text)}
        />
        <AppInput
          label="Email"
          placeholder="Enter your email"
          value={form.email}
          onChangeText={(text) => updateField('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
        />
        <AppInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={form.phone}
          onChangeText={(text) => updateField('phone', text)}
          keyboardType="phone-pad"
        />
        <AppInput
          label="Password"
          placeholder="Create a password"
          value={form.password}
          onChangeText={(text) => updateField('password', text)}
          secureTextEntry
        />
        <AppInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChangeText={(text) => updateField('confirmPassword', text)}
          secureTextEntry
        />

        <AppButton
          title="Create Account"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.loginLink}>
          <Link href="/(auth)/welcome" asChild>
            <AppButton
              title="Already have an account? Login"
              variant="ghost"
              size="small"
            />
          </Link>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: Spacing.lg,
  },
  loginLink: {
    marginTop: Spacing.md,
  },
});
