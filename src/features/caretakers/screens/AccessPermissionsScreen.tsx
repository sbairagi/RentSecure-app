import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AccessPermissionsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const permissions = [
    { key: 'view_property', label: 'View Property', granted: true },
    { key: 'view_building', label: 'View Building', granted: true },
    { key: 'view_unit', label: 'View Unit', granted: true },
    { key: 'view_renter', label: 'View Renter', granted: false },
    { key: 'view_rent_records', label: 'View Rent Records', granted: false },
    { key: 'view_payments', label: 'View Payments', granted: false },
    { key: 'manage_renters', label: 'Manage Renters', granted: false },
    { key: 'manage_units', label: 'Manage Units', granted: false },
    { key: 'manage_documents', label: 'Manage Documents', granted: false },
    { key: 'manage_maintenance', label: 'Manage Maintenance', granted: false },
    { key: 'view_reports', label: 'View Reports', granted: false },
    { key: 'receive_notifications', label: 'Receive Notifications', granted: true },
  ];

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Access Permissions</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>
              Caretaker #{id} permissions are managed on the backend.
            </Text>
            <View style={styles.permissionList}>
              {permissions.map((perm) => (
                <View key={perm.key} style={styles.permissionRow}>
                  <Text style={[styles.permissionLabel, { color: theme.text }]}>{perm.label}</Text>
                  <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: perm.granted
                        ? '#D1FAE5'
                        : '#F3F4F6',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color: perm.granted
                          ? theme.success
                          : theme.subText,
                      },
                    ]}
                    >
                      {perm.granted ? 'Granted' : 'Not Granted'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  card: {
    padding: Spacing.md,
    borderRadius: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  permissionList: {
    gap: 10,
    marginTop: 8,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  permissionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
