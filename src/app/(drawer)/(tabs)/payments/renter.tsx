import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function PaymentsRenterScreen() {
  return (
    <RouteGuard requireAuth requireRole={['renter']}>
      <PermissionGuard permissions={['payment:read']}>
        <View style={styles.container}>
          <Text style={styles.title}>My Payments</Text>
          <Text style={styles.subtitle}>View and pay your rent</Text>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center' },
});
