import { Spacing } from '@/constants/theme';
import { useRenter } from '@/features/renters/hooks/useRenter';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Title } from 'react-native-paper';

export default function AssignUnitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { assignUnit, isAssigningUnit } = useRenter(Number(id));

  const handleAssign = async (unitId: number) => {
    try {
      await assignUnit({ unit_id: unitId });
      router.back();
    } catch {
      // handle error
    }
  };

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Assign Unit</Title>
        <Text style={styles.description}>
          Select a unit to assign to this renter. This feature requires backend support.
        </Text>
        <View style={styles.actions}>
          <Button mode="outlined" onPress={() => router.back()}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={() => handleAssign(1)}
            loading={isAssigningUnit}
            disabled={isAssigningUnit}
          >
            Assign
          </Button>
        </View>
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
