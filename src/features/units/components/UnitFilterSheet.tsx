import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UNIT_CONSTANTS } from '../constants/unitConstants';
import type { UnitFilters } from '../types/units';

interface UnitFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: UnitFilters;
  onFilterChange: (filters: UnitFilters) => void;
  onApply: () => void;
  buildings?: { id: number; name: string }[];
}

export const UnitFilterSheet: React.FC<UnitFilterSheetProps> = ({
  visible,
  onClose,
  filters,
  onFilterChange,
  onApply,
  buildings = [],
}) => {
  const theme = useTheme();

  const unitTypes = Object.entries(UNIT_CONSTANTS.UNIT_TYPE_LABELS).map(([value, label]) => ({
    value: value as string,
    label,
  }));

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'vacant', label: 'Vacant' },
    { value: 'occupied', label: 'Occupied' },
  ];

  const availabilityOptions = [
    { value: undefined, label: 'All' },
    { value: true, label: 'Available Now' },
    { value: false, label: 'Occupied' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Status</Text>
              <View style={styles.optionsContainer}>
                {statuses.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      filters.status === option.value && {
                        backgroundColor: theme.primary,
                      },
                    ]}
                    onPress={() =>
                      onFilterChange({ ...filters, status: option.value as UnitFilters['status'] })
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: filters.status === option.value ? '#fff' : theme.text },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Unit Type</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[styles.option, !filters.unit_type && { backgroundColor: theme.primary }]}
                  onPress={() => onFilterChange({ ...filters, unit_type: '' })}
                >
                  <Text
                    style={[styles.optionText, { color: !filters.unit_type ? '#fff' : theme.text }]}
                  >
                    All Types
                  </Text>
                </TouchableOpacity>
                {unitTypes.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      filters.unit_type === option.value && {
                        backgroundColor: theme.primary,
                      },
                    ]}
                    onPress={() =>
                      onFilterChange({
                        ...filters,
                        unit_type: option.value as UnitFilters['unit_type'],
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: filters.unit_type === option.value ? '#fff' : theme.text },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: theme.border }]}
              onPress={() => onFilterChange({})}
            >
              <Text style={[styles.resetButtonText, { color: theme.text }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: theme.primary }]}
              onPress={onApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 20,
    color: '#9ca3af',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: Spacing.md,
  },
  resetButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
