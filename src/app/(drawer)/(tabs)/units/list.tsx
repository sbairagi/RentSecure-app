import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function UnitsListScreen() {
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['unit:read']}>
        <View style={styles.container}>
          <Text style={styles.title}>Units</Text>
          <Text style={styles.subtitle}>Manage rental units</Text>
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
