import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { DocumentFilterSheetProps, SelectedFilters } from '../types';

const FILTER_OPTIONS = [
  { label: 'All Types', value: '' },
  { label: 'Images', value: 'image' },
  { label: 'PDFs', value: 'pdf' },
  { label: 'Documents', value: 'doc' },
  { label: 'Spreadsheets', value: 'excel' },
  { label: 'Archived', value: 'archived' },
  { label: 'Favorites', value: 'favorite' },
];

export const DocumentFilterSheet: React.FC<DocumentFilterSheetProps> = ({
  visible,
  onClose,
  filters,
  onApply,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  const handleSelect = (key: keyof SelectedFilters, value: any) => {
    onApply({ ...filters, [key]: value });
  };

  const handleClear = () => {
    onApply({});
    onClose();
  };

  const handleApply = () => {
    onClose();
  };

  return (
    <View style={styles.overlay} onTouchStart={onClose}>
      <View
        style={[styles.sheet, { backgroundColor: theme.card }]}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.subText }]}>File Type</Text>
          <View style={styles.options}>
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      (option.value === '' && !filters.type) ||
                      filters.type === option.value
                        ? '#4f46e5'
                        : theme.border,
                  },
                ]}
                onPress={() =>
                  handleSelect('type', option.value === '' ? undefined : option.value)
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        (option.value === '' && !filters.type) ||
                        filters.type === option.value
                          ? '#fff'
                          : theme.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  close: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  option: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  clearButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
