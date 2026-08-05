import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { SubscriptionGuard } from '@/navigation/components/SubscriptionGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function OwnerDashboardScreen() {
  return (
    <RouteGuard
      requireAuth
      requireRole={[
        'super_admin',
        'admin',
        'property_owner',
        'caretaker',
        'ca_partner',
        'support_executive',
      ]}
    >
      <SubscriptionGuard>
        <PermissionGuard permissions={['dashboard:read']}>
          <View style={styles.container}>
            <Text style={styles.title}>Owner Dashboard</Text>
            <Text style={styles.subtitle}>Property overview, rent collection, and analytics</Text>
          </View>
        </PermissionGuard>
      </SubscriptionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
