import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface DropdownProps<T> {
  label?: string;
  value: T | null;
  items: { label: string; value: T }[];
  onSelect: (item: { label: string; value: T }) => void;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export function Dropdown<T>({
  label,
  value,
  items,
  onSelect,
  placeholder = 'Select...',
  error,
  containerStyle,
  disabled = false,
}: DropdownProps<T>) {
  const theme = useDesignSystemTheme();

  const selectedItem = items.find((item) => item.value === value);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.colors.neutral[700] }]}>{label}</Text>}
      <Pressable
        onPress={() => !disabled && onSelect(items[0])}
        disabled={disabled}
        style={({ pressed }) => [
          styles.dropdown,
          {
            borderColor: error ? theme.colors.error[500] : theme.colors.neutral[200],
            backgroundColor: disabled ? theme.colors.neutral[100] : theme.colors.neutral[50],
          },
          pressed && !disabled && { opacity: 0.8 },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: selectedItem ? theme.colors.neutral[900] : theme.colors.neutral[400] },
          ]}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Text style={[styles.arrow, { color: theme.colors.neutral[400] }]}>▼</Text>
      </Pressable>
      {error && <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing.xs,
    letterSpacing: 0.25,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  text: {
    flex: 1,
    fontSize: 14,
  },
  arrow: {
    fontSize: 12,
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
