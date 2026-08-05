import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { StyleSheet, Text, View } from 'react-native';

export default function AgreementsListScreen() {
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['agreement:read']}>
        <FeatureLimitGuard featureKey="rent_agreement_drafting">
          <View style={styles.container}>
            <Text style={styles.title}>Agreements</Text>
            <Text style={styles.subtitle}>Manage rent agreements and drafts</Text>
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
