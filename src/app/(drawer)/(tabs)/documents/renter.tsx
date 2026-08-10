import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRenterDocuments } from '@/features/renter-dashboard/hooks/useRenterDashboard';
import { DashboardErrorState } from '@/features/renter-dashboard/components/DashboardErrorState';
import { Button } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RenterDocumentsScreen() {
  const theme = useTheme();
  const { documents, isLoading, error, refetch } = useRenterDocuments();

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['document:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading documents...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !documents) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['document:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <DashboardErrorState message={error || 'No documents found'} onRetry={refetch} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['document:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              My Documents
            </Text>
          </View>

          <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 16 }}>
                Identity & Agreement
              </Text>

              <View style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                    ID Proof
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {documents.id_proof_url ? 'Available' : 'Not uploaded'}
                  </Text>
                </View>
                {documents.id_proof_url && (
                  <Button mode="outlined" onPress={() => {}} style={styles.documentButton}>
                    View
                  </Button>
                )}
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

              <View style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                    Rent Agreement
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {documents.rent_agreement_url ? 'Available' : 'Not uploaded'}
                  </Text>
                </View>
                {documents.rent_agreement_url && (
                  <Button mode="outlined" onPress={() => {}} style={styles.documentButton}>
                    View
                  </Button>
                )}
              </View>
            </View>
          </Animated.View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentButton: {
    borderRadius: 8,
  },
  divider: {
    height: 1,
  },
});