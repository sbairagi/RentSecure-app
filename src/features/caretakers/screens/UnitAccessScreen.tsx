import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCaretaker } from '../hooks';

export default function UnitAccessScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { caretaker } = useCaretaker(Number(id));

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Unit Access</Text>
            <Text style={[styles.description, { color: theme.subText }]}>
              This caretaker currently has access to the following unit:
            </Text>
            <View style={styles.unitBox}>
              <Text style={[styles.unitLabel, { color: theme.subText }]}>Unit ID</Text>
              <Text style={[styles.unitValue, { color: theme.text }]}>
                {caretaker ? caretaker.unit : 'Loading...'}
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
  unitBox: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  unitLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  unitValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});
