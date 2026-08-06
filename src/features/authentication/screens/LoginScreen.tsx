import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { SocialLoginButtons } from '@/features/authentication/components/SocialLoginButtons';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';
import { Alert } from 'react-native';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login, socialLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (): boolean => {
    const result = loginSchema.safeParse({ email, password });
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
      await login({ email, password });
      router.replace('/(drawer)/(tabs)/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    Alert.alert('Coming soon', 'Google sign-in requires OAuth client configuration.');
  };

  const handleAppleLogin = async () => {
    Alert.alert('Coming soon', 'Apple sign-in requires Apple identity token verification.');
  };

  return (
    <ScreenContainer>
      <AuthHeader title="Welcome Back" subtitle="Sign in to your account" />

      <View style={styles.form}>
        <AppInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
        />

        <AppInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton title="Login" onPress={handleSubmit} loading={loading} disabled={loading} />

        <View style={styles.links}>
          <Link href="/(auth)/forgot-password" asChild>
            <AppButton
              title="Forgot Password?"
              variant="ghost"
              size="small"
            />
          </Link>
          <Link href="/(auth)/register" asChild>
            <AppButton
              title="Create Account"
              variant="ghost"
              size="small"
            />
          </Link>
        </View>
      </View>

      <SocialLoginButtons onGooglePress={handleGoogleLogin} onApplePress={handleAppleLogin} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: Spacing.lg,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
});
