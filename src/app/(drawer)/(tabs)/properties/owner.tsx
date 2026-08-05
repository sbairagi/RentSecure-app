import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function PropertiesOwnerScreen() {
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['property:read']}>
        <FeatureLimitGuard featureKey="properties">
          <View style={styles.container}>
            <Text style={styles.title}>Properties</Text>
            <Text style={styles.subtitle}>Manage your property portfolio</Text>
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
