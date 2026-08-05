import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { SubscriptionGuard } from '@/navigation/components/SubscriptionGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function SubscriptionPlansScreen() {
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <SubscriptionGuard>
          <View style={styles.container}>
            <Text style={styles.title}>Subscription Plans</Text>
            <Text style={styles.subtitle}>Choose the right plan for your needs</Text>
          </View>
        </SubscriptionGuard>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center' },
});
