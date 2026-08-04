import { AppButton } from '@/components/common/AppButton';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { SocialLoginButtons } from '@/features/authentication/components/SocialLoginButtons';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { socialLogin } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await socialLogin('google', 'mock_token');
    } catch {
      // Silently fail
    }
  };

  const handleAppleLogin = async () => {
    try {
      await socialLogin('apple', 'mock_token');
    } catch {
      // Silently fail
    }
  };

  return (
    <ScreenContainer>
      <AuthHeader
        title="Welcome to SecureNest"
        subtitle="Manage your properties with ease. Secure, fast, and reliable."
      />

      <View style={styles.content}>
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>&#128274;</Text>
            <Text style={styles.featureText}>Secure & Encrypted</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🏠</Text>
            <Text style={styles.featureText}>Property Management</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>&#128179;</Text>
            <Text style={styles.featureText}>Easy Payments</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Login with Phone"
            onPress={() => router.push('/(auth)/login')}
            variant="primary"
            size="large"
          />
          <AppButton
            title="Create Account"
            onPress={() => router.push('/(auth)/register')}
            variant="outline"
            size="large"
            style={styles.secondaryButton}
          />
        </View>

        <SocialLoginButtons onGooglePress={handleGoogleLogin} onApplePress={handleAppleLogin} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xxl,
  },
  featuresContainer: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 32,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 16,
    opacity: 0.8,
  },
  buttonContainer: {
    marginBottom: Spacing.lg,
  },
  secondaryButton: {
    marginTop: Spacing.md,
  },
});
