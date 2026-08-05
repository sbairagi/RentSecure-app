import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function RentersListScreen() {
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['renter:read']}>
        <FeatureLimitGuard featureKey="max_renters">
          <View style={styles.container}>
            <Text style={styles.title}>Renters</Text>
            <Text style={styles.subtitle}>Manage renter profiles and agreements</Text>
          </View>
        </FeatureLimitGuard>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center' },
});
