import { Spacing } from '@/constants/theme';
import { useRenter } from '@/features/renters/hooks/useRenter';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Button, Title, TextInput, useTheme } from 'react-native-paper';
import { rentersRepository } from '../repository/rentersRepository';
import type { Unit } from '../types/renters';

export default function AssignUnitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { assignUnit, isAssigningUnit, renter } = useRenter(Number(id));
  const theme = useTheme();
  
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadUnits();
  }, []);
  
  const loadUnits = async () => {
    try {
      const data = await rentersRepository.fetchUnits();
      setUnits(data.filter((u: Unit) => !u.is_archived));
    } catch (err) {
      setError('Failed to load units. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAssign = async () => {
    if (!selectedUnitId) return;
    
    try {
      await assignUnit({ unit_id: selectedUnitId });
      router.back();
    } catch (err: any) {
      setError(err.message || 'Failed to assign unit');
    }
  };
  
  const renderUnit = ({ item }: { item: Unit }) => (
    <TouchableOpacity
      onPress={() => setSelectedUnitId(item.id)}
      style={[
        styles.unitItem,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: selectedUnitId === item.id ? theme.colors.primary : theme.colors.outline,
          borderWidth: selectedUnitId === item.id ? 2 : 1,
        }
      ]}
    >
      <Text style={[styles.unitName, { color: theme.colors.onSurface }]}>
        {item.building_name} - {item.unit}
      </Text>
      <Text style={[styles.unitDetails, { color: theme.colors.onSurfaceVariant }]}>
        {item.address_line}, {item.city}
      </Text>
      <Text style={[styles.unitStatus, { color: item.is_vacant ? '#16a34a' : '#dc2626' }]}>
        {item.is_vacant ? 'Vacant' : 'Occupied'}
      </Text>
    </TouchableOpacity>
  );
  
  if (loading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['renter:write']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.loadingText}>Loading units...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }
  
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['renter:write']}>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <Title style={styles.title}>Assign Unit</Title>
          <Text style={styles.subtitle}>
            Select a unit to assign to {renter?.name || 'this renter'}
          </Text>
          
          {error && (
            <View style={[styles.errorBanner, { backgroundColor: '#fee2e2' }]}>
              <Text style={[styles.errorText, { color: '#dc2626' }]}>{error}</Text>
            </View>
          )}
          
          <FlatList
            data={units}
            renderItem={renderUnit}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: Spacing.lg }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No available units</Text>
            }
          />
          
          <View style={styles.actions}>
            <Button mode="outlined" onPress={() => router.back()} disabled={isAssigningUnit}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAssign}
              loading={isAssigningUnit}
              disabled={isAssigningUnit || !selectedUnitId}
            >
              Assign Unit
            </Button>
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
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: Spacing.md,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
  unitItem: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  unitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  unitDetails: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  unitStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorBanner: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});