import { Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Unit } from '../types/units';

interface UnitCardProps {
  unit: Unit;
  onPress: () => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({ unit, onPress }) => {
  const statusColor = unit.is_vacant ? '#16a34a' : '#2563eb';
  const statusLabel = unit.is_vacant ? 'Vacant' : 'Occupied';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.unitNumber}>{unit.unit}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
        <Text style={styles.buildingName}>{unit.building_name || 'No Building'}</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{unit.unit_type.replace(/_/g, ' ')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {unit.city}, {unit.state}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, { color: statusColor }]}>
            {unit.status.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.date}>Added {new Date(unit.created_at).toLocaleDateString()}</Text>
        {unit.is_archived && (
          <View style={styles.archivedBadge}>
            <Text style={styles.archivedText}>Archived</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  unitNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  buildingName: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
  },
  value: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopColor: '#f3f4f6',
    borderTopWidth: 1,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  archivedBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  archivedText: {
    fontSize: 11,
    color: '#6b7280',
  },
});
