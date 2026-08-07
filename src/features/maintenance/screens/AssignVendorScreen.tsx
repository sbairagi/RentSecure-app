import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/theme';

export default function AssignVendorScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['maintenance:write']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Assign Vendor</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Request ID: {params.id}
          </Text>
          <Text style={[styles.comingSoon, { color: theme.textSecondary }]}>
            Vendor selection will be available once the backend implements vendor management.
          </Text>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  comingSoon: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 32,
  },
});
