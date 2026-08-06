import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { SortOption } from '../types/units';

interface UnitSortSheetProps {
  visible: boolean;
  onClose: () => void;
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

export const UnitSortSheet: React.FC<UnitSortSheetProps> = ({
  visible,
  onClose,
  selected,
  onSelect,
}) => {
  const theme = useTheme();
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'occupancy', label: 'Occupancy' },
  ];

  const getBackendOrdering = (option: SortOption): string => {
    switch (option) {
      case 'newest':
        return '-created_at';
      case 'oldest':
        return 'created_at';
      case 'alphabetical':
        return 'unit';
      case 'occupancy':
        return '-is_vacant';
      default:
        return '-created_at';
    }
  };

  const handleSelect = (option: SortOption) => {
    onSelect(option);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Sort By</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selected === option.value && { backgroundColor: theme.primary + '20' },
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: selected === option.value ? theme.primary : theme.text },
                  ]}
                >
                  {option.label}
                </Text>
                {selected === option.value && (
                  <Text style={[styles.checkmark, { color: theme.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
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
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 15,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
});
