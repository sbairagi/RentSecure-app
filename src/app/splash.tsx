import { useAppStore } from '@/bootstrap/stores/appStore';
import { mapBackendRole } from '@/navigation/types/navigation.types';
import { ROLE_REDIRECT } from '@/navigation/utils/roleRedirect';
import { checkSubscriptionAccess } from '@/navigation/utils/subscription';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const { subscription } = useSubscriptionStore();
  const isInitialized = useAppStore((s) => s.isInitialized);

  useEffect(() => {
    if (!isInitialized) return;

    const navigate = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!isAuthenticated || !accessToken) {
        router.replace('/(auth)/welcome');
        return;
      }

      const role = mapBackendRole(user?.role);
      const defaultRoute = ROLE_REDIRECT[role] || '/(auth)/welcome';

      if (['property_owner', 'ca_partner', 'admin', 'super_admin'].includes(role)) {
        const result = await checkSubscriptionAccess();
        if (!result.hasAccess && defaultRoute !== '/(drawer)/(tabs)/subscription') {
          router.replace('/(drawer)/(tabs)/subscription');
          return;
        }
      }

      router.replace(defaultRoute as any);
    };

    navigate();
  }, [isInitialized, isAuthenticated, accessToken, user, subscription, router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🏠</Text>
        <Text style={styles.appName}>SecureNest</Text>
        <Text style={styles.tagline}>Smart Property Management</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#c7d2fe',
  },
});
