import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { DocumentSortSheetProps, SortOption } from '../types';
import { DOCUMENT_CONSTANTS } from '../constants/documents';

export const DocumentSortSheet: React.FC<DocumentSortSheetProps> = ({
  visible,
  onClose,
  sortBy,
  onApply,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  const options: SortOption[] = [
    { label: 'Newest First', value: 'newest', direction: 'desc' },
    { label: 'Oldest First', value: 'oldest', direction: 'asc' },
    { label: 'Name A-Z', value: 'name_asc', direction: 'asc' },
    { label: 'Name Z-A', value: 'name_desc', direction: 'desc' },
    { label: 'Size (Smallest)', value: 'size_asc', direction: 'asc' },
    { label: 'Size (Largest)', value: 'size_desc', direction: 'desc' },
    { label: 'File Type', value: 'type', direction: 'asc' },
    { label: 'Favorites', value: 'favorite', direction: 'desc' },
  ];

  const handleSelect = (option: SortOption) => {
    onApply(option);
    onClose();
  };

  return (
    <View style={styles.overlay} onTouchStart={onClose}>
      <View
        style={[styles.sheet, { backgroundColor: theme.card }]}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Sort By</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.options}>
          {options.map((option) => {
            const isSelected = sortBy?.value === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  {
                    backgroundColor: isSelected ? '#4f46e5' : 'transparent',
                    borderColor: isSelected ? '#4f46e5' : theme.border,
                  },
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? '#fff' : theme.text },
                  ]}
                >
                  {option.label}
                </Text>
                {isSelected && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
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
    maxHeight: '60%',
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
  options: {
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  check: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
