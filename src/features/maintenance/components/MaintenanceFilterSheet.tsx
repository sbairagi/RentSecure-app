import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MAINTENANCE_CONSTANTS } from '../constants';
import type { MaintenanceFilters } from '../types';

interface MaintenanceFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: MaintenanceFilters;
  onFilterChange: (filters: MaintenanceFilters) => void;
  onApply?: () => void;
}

export const MaintenanceFilterSheet: React.FC<MaintenanceFilterSheetProps> = ({
  visible,
  onClose,
  filters,
  onFilterChange,
  onApply,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  const statusOptions = Object.entries(MAINTENANCE_CONSTANTS.STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const priorityOptions = Object.entries(MAINTENANCE_CONSTANTS.PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const categoryOptions = Object.entries(MAINTENANCE_CONSTANTS.CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const handleStatusSelect = (status: string) => {
    onFilterChange({ ...filters, status: status as MaintenanceFilters['status'] });
  };

  const handlePrioritySelect = (priority: string) => {
    onFilterChange({ ...filters, priority: priority as MaintenanceFilters['priority'] });
  };

  const handleCategorySelect = (category: string) => {
    onFilterChange({ ...filters, category: category as MaintenanceFilters['category'] });
  };

  const handleClear = () => {
    onFilterChange({});
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Status</Text>
          <View style={styles.optionsRow}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionChip,
                  filters.status === option.value && { backgroundColor: theme.primary },
                ]}
                onPress={() => handleStatusSelect(option.value)}
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Priority</Text>
          <View style={styles.optionsRow}>
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionChip,
                  filters.priority === option.value && { backgroundColor: theme.primary },
                ]}
                onPress={() => handlePrioritySelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: filters.priority === option.value ? '#fff' : theme.text },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Category</Text>
          <View style={styles.optionsRow}>
            {categoryOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionChip,
                  filters.category === option.value && { backgroundColor: theme.primary },
                ]}
                onPress={() => handleCategorySelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: filters.category === option.value ? '#fff' : theme.text },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: theme.border }]}
            onPress={handleClear}
          >
            <Text style={[styles.clearText, { color: theme.textSecondary }]}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              onApply?.();
              onClose();
            }}
          >
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
