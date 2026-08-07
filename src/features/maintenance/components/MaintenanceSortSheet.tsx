import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MAINTENANCE_CONSTANTS } from '../constants';

type SortOption = 'newest' | 'oldest' | 'priority' | 'status' | 'updated';

interface MaintenanceSortSheetProps {
  visible: boolean;
  onClose: () => void;
  selected: SortOption;
  onSelect: (value: SortOption) => void;
}

export const MaintenanceSortSheet: React.FC<MaintenanceSortSheetProps> = ({
  visible,
  onClose,
  selected,
  onSelect,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: MAINTENANCE_CONSTANTS.SORT_LABELS.newest },
    { value: 'oldest', label: MAINTENANCE_CONSTANTS.SORT_LABELS.oldest },
    { value: 'priority', label: MAINTENANCE_CONSTANTS.SORT_LABELS.priority },
    { value: 'status', label: MAINTENANCE_CONSTANTS.SORT_LABELS.status },
    { value: 'updated', label: MAINTENANCE_CONSTANTS.SORT_LABELS.updated },
  ];

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Sort By</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.options}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                selected === option.value && { backgroundColor: theme.primary + '20' },
              ]}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 16,
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
