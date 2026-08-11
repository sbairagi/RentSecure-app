import { Radius, Spacing } from '@/constants/theme';
import { Button } from '@/design-system/buttons/Button';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BuildingFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    city?: string;
    state?: string;
    country?: string;
  };
  onFilterChange: (filters: { city?: string; state?: string; country?: string }) => void;
  onApply: () => void;
}

export const BuildingFilterSheet: React.FC<BuildingFilterSheetProps> = ({
  visible,
  onClose,
  filters,
  onFilterChange,
  onApply,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.sheet, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>City</Text>
          <Button
            title={filters.city || 'Any'}
            variant="outlined"
            onPress={() => onFilterChange({ ...filters, city: filters.city ? '' : 'Any' })}
          />
        </View>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>State</Text>
          <Button
            title={filters.state || 'Any'}
            variant="outlined"
            onPress={() => onFilterChange({ ...filters, state: filters.state ? '' : 'Any' })}
          />
        </View>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Country</Text>
          <Button
            title={filters.country || 'Any'}
            variant="outlined"
            onPress={() => onFilterChange({ ...filters, country: filters.country ? '' : 'Any' })}
          />
        </View>
        <View style={styles.actions}>
          <Button title="Cancel" variant="ghost" onPress={onClose} />
          <Button title="Apply" onPress={onApply} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  field: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
});
