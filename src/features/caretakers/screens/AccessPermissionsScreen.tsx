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

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Access Permissions</Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>
              Caretaker #{id} permissions are managed on the backend.
            </Text>
            <View style={styles.infoBox}>
              <Text style={[styles.infoText, { color: theme.subText }]}>
                The current backend does not expose granular caretaker permissions.
              </Text>
              <Text style={[styles.infoText, { color: theme.subText }]}>
                All caretaker access is controlled through unit ownership and Django groups.
              </Text>
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
  infoBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
  },
});
