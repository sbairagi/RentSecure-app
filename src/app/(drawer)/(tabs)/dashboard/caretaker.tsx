import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function CaretakerDashboardScreen() {
  return (
    <RouteGuard requireAuth requireRole={['caretaker']}>
      <PermissionGuard permissions={['dashboard:read']}>
        <View style={styles.container}>
          <Text style={styles.title}>Caretaker Dashboard</Text>
          <Text style={styles.subtitle}>Building and unit management overview</Text>
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
