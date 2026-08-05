import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function RenterDashboardScreen() {
  return (
    <RouteGuard requireAuth requireRole={['renter']}>
      <PermissionGuard permissions={['dashboard:read']}>
        <View style={styles.container}>
          <Text style={styles.title}>Renter Dashboard</Text>
          <Text style={styles.subtitle}>Your rent payments, agreements, and notifications</Text>
        </View>
      </PermissionGuard>
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
