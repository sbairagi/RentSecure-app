import { ScreenContainer } from '@/components/common/ScreenContainer';
import { Spacing } from '@/constants/theme';
import { AuthHeader } from '@/features/authentication/components/AuthHeader';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user, clearSession } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (isAuthenticated && user) {
        router.replace('/(tabs)');
      } else {
        clearSession();
        router.replace('/(auth)/welcome');
      }
    };

    initializeApp();
  }, [isAuthenticated, user, clearSession, router]);

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <AuthHeader title="SecureNest" subtitle="Your Property, Simplified" />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
