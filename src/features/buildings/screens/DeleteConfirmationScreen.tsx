import { AppText } from '@/components/common/AppText';
import { Radius, Spacing } from '@/constants/theme';
import { Button } from '@/design-system/buttons/Button';
import { useBuilding } from '@/features/buildings/hooks/useBuilding';
import { useBuildings } from '@/features/buildings/hooks/useBuildings';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function DeleteConfirmationScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { building } = useBuilding(Number(id));
  const { deleteBuilding, isDeleting } = useBuildings();

  const handleDelete = async () => {
    await deleteBuilding(Number(id));
    router.replace('/(drawer)/(tabs)/buildings');
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['building:write']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <AppText style={[styles.title, { color: theme.text }]}>Delete Building</AppText>
            <AppText style={[styles.message, { color: theme.textSecondary }]}>
              Are you sure you want to delete &quot;{building?.name}&quot;? This action cannot be
              undone.
            </AppText>
            <View style={styles.actions}>
              <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
              <Button title={isDeleting ? 'Deleting...' : 'Delete'} onPress={handleDelete} />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
});
