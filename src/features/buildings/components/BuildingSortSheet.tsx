import { Radius, Spacing } from '@/constants/theme';
import { Button } from '@/design-system/buttons/Button';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'revenue' | 'occupancy';

interface BuildingSortSheetProps {
  visible: boolean;
  onClose: () => void;
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'occupancy', label: 'Occupancy' },
];

export const BuildingSortSheet: React.FC<BuildingSortSheetProps> = ({
  visible,
  onClose,
  selected,
  onSelect,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.sheet, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Sort By</Text>
        {SORT_OPTIONS.map((option) => (
          <Button
            key={option.value}
            title={option.label}
            variant={selected === option.value ? 'primary' : 'ghost'}
            onPress={() => onSelect(option.value)}
          />
        ))}
        <Button title="Close" variant="ghost" onPress={onClose} />
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
});
