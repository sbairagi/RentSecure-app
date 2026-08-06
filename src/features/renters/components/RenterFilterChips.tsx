import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import type { RenterFilterChipsProps, SelectedFilters } from '../types';

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Notice Period', value: 'notice_period' },
  { label: 'Revoked', value: 'revoked' },
  { label: 'Deactivated', value: 'deactivated' },
];

const POLICE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Verified', value: 'verified' },
  { label: 'Pending', value: 'pending' },
  { label: 'Not Submitted', value: 'not_submitted' },
];

export const RenterFilterChips: React.FC<RenterFilterChipsProps> = ({
  selectedFilters,
  onFilterChange,
}) => {
  const theme = useTheme();

  const toggleFilter = (key: keyof SelectedFilters, value: string) => {
    onFilterChange({
      ...selectedFilters,
      [key]: selectedFilters[key] === value ? undefined : value,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          <Text style={[styles.label, { color: theme.subText }]}>Status</Text>
          {STATUS_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={selectedFilters.status === option.value}
              onPress={() => toggleFilter('status', option.value)}
              style={styles.chip}
              showSelectedCheck={false}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${option.label}`}
            >
              {option.label}
            </Chip>
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          <Text style={[styles.label, { color: theme.subText }]}>Police</Text>
          {POLICE_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={selectedFilters.police_verification === option.value}
              onPress={() => toggleFilter('police_verification', option.value)}
              style={styles.chip}
              showSelectedCheck={false}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${option.label}`}
            >
              {option.label}
            </Chip>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  chip: {
    marginRight: 8,
  },
});
