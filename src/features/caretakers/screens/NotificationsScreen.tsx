import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotificationsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['notification:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
            <Text style={[styles.description, { color: theme.subText }]}>
              Notifications for caretaker events are sent through the generic notification system.
            </Text>
            <View style={styles.infoBox}>
              <Text style={[styles.infoText, { color: theme.subText }]}>
                Caretaker ID: {id}
              </Text>
              <Text style={[styles.infoText, { color: theme.subText }]}>
                Check the Notifications tab for updates.
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
  description: {
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
