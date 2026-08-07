import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import type { CaretakerFilters } from '../types/caretakers';

interface CaretakerFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: CaretakerFilters;
  onFilterChange: (filters: CaretakerFilters) => void;
  onApply?: () => void;
}

export const CaretakerFilterSheet: React.FC<CaretakerFilterSheetProps> = ({
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
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.subText }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Status</Text>
          <View style={styles.statusRow}>
            {[
              { label: 'All', value: undefined },
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ].map((option) => {
              const isSelected = filters.is_active === option.value;
              return (
                <TouchableOpacity
                  key={String(option.value)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.background,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => onFilterChange({ ...filters, is_active: option.value })}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: isSelected ? '#fff' : theme.text },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.resetButton, { borderColor: theme.border }]}
            onPress={() => {
              onFilterChange({});
              onApply?.();
            }}
          >
            <Text style={[styles.resetButtonText, { color: theme.text }]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              onApply?.();
              onClose();
            }}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
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
    maxHeight: '50%',
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
  closeButton: {
    fontSize: 20,
  },
  content: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
