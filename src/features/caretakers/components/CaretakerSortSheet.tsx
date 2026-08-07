import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { CARETAKER_CONSTANTS } from '../constants/caretakerConstants';

interface CaretakerSortSheetProps {
  visible: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (sortBy: string) => void;
}

export const CaretakerSortSheet: React.FC<CaretakerSortSheetProps> = ({
  visible,
  onClose,
  selected,
  onSelect,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  const options = [
    { value: CARETAKER_CONSTANTS.SORT_OPTIONS.newest, label: 'Newest First' },
    { value: CARETAKER_CONSTANTS.SORT_OPTIONS.oldest, label: 'Oldest First' },
    { value: CARETAKER_CONSTANTS.SORT_OPTIONS.name_asc, label: 'Name (A-Z)' },
    { value: CARETAKER_CONSTANTS.SORT_OPTIONS.name_desc, label: 'Name (Z-A)' },
    {
      value: CARETAKER_CONSTANTS.SORT_OPTIONS.joining_date_desc,
      label: 'Joining Date (Newest)',
    },
    {
      value: CARETAKER_CONSTANTS.SORT_OPTIONS.joining_date_asc,
      label: 'Joining Date (Oldest)',
    },
  ];

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Sort By</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.subText }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  {
                    backgroundColor: isSelected ? theme.primary + '15' : 'transparent',
                  },
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? theme.primary : theme.text },
                  ]}
                >
                  {option.label}
                </Text>
                {isSelected && <Text style={[styles.checkIcon, { color: theme.primary }]}>✓</Text>}
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
  closeButton: {
    fontSize: 20,
  },
  content: {
    gap: 4,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
});
