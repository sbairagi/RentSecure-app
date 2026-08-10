import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRenterAgreement } from '@/features/renter-dashboard/hooks/useRenterDashboard';
import { DashboardErrorState } from '@/features/renter-dashboard/components/DashboardErrorState';
import { Button } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RenterAgreementScreen() {
  const theme = useTheme();
  const { agreement, isLoading, error, refetch } = useRenterAgreement();

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['agreement:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading agreement...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !agreement) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['agreement:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <DashboardErrorState message={error || 'No agreement found'} onRetry={refetch} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const isSigned = agreement.owner_signed && agreement.renter_signed;

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['agreement:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Rental Agreement
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isSigned
                    ? `${theme.colors.primary}15`
                    : `${theme.colors.tertiary}15`,
                },
              ]}
            >
              <Text
                style={{
                  color: isSigned ? theme.colors.primary : theme.colors.tertiary,
                  fontWeight: '600',
                }}
              >
                {isSigned ? 'SIGNED' : 'PENDING'}
              </Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 16 }}>
                Agreement Details
              </Text>

              <DetailRow label="Unit" value={agreement.unit_name || 'N/A'} theme={theme} />
              <DetailRow label="Property" value={agreement.building_name || 'N/A'} theme={theme} />
              <DetailRow label="Generated" value={agreement.generated_at ? new Date(agreement.generated_at).toLocaleDateString('en-IN') : 'N/A'} theme={theme} />
              <DetailRow label="Owner Signed" value={agreement.owner_signed ? 'Yes' : 'No'} theme={theme} valueColor={agreement.owner_signed ? theme.colors.primary : theme.colors.error} />
              <DetailRow label="You Signed" value={agreement.renter_signed ? 'Yes' : 'No'} theme={theme} valueColor={agreement.renter_signed ? theme.colors.primary : theme.colors.error} />
            </View>

            {agreement.document_url && (
              <Animated.View entering={FadeInDown.duration(400).delay(100)} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant, marginTop: 16 }]}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 12 }}>
                  Agreement Document
                </Text>
                <Button
                  mode="contained"
                  onPress={() => {}}
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                >
                  View Agreement
                </Button>
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

function DetailRow({ label, value, theme, valueColor }: { label: string; value: string; theme: any; valueColor?: string }) {
  return (
    <View style={styles.detailRow}>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Text variant="bodyMedium" style={{ color: valueColor || theme.colors.onSurface, fontWeight: '500' }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  content: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  button: {
    borderRadius: 12,
  },
});