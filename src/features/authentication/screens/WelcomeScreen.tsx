import { AppButton } from '@/components/common/AppButton';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { SocialLoginButtons } from '@/features/authentication/components/SocialLoginButtons';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  const { socialLogin } = useAuth();

  const handleGoogleLogin = async () => {
    Alert.alert('Coming soon', 'Google sign-in requires OAuth client configuration.');
  };

  const handleAppleLogin = async () => {
    Alert.alert('Coming soon', 'Apple sign-in requires Apple identity token verification.');
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
          <Link href="/(auth)/login" asChild>
            <AppButton title="Login with Phone" variant="primary" size="large" />
          </Link>
          <Link href="/(auth)/register" asChild>
            <AppButton title="Create Account" variant="outline" size="large" style={styles.secondaryButton} />
          </Link>
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
