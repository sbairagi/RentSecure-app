import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function CaretakersListScreen() {
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:read']}>
        <FeatureLimitGuard featureKey="max_caretakers">
          <View style={styles.container}>
            <Text style={styles.title}>Caretakers</Text>
            <Text style={styles.subtitle}>Manage caretaker assignments</Text>
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
