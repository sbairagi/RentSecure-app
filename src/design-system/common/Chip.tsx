import React from 'react';
import { Pressable, StyleSheet, Text, type TextStyle, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  onClose,
  disabled = false,
  style,
  textStyle,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary[600] : theme.colors.neutral[100],
          borderColor: selected ? theme.colors.primary[600] : theme.colors.neutral[200],
        },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: selected ? colors.white : theme.colors.neutral[700],
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
      {onClose && (
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text
            style={[
              styles.closeText,
              { color: selected ? colors.white : theme.colors.neutral[500] },
            ]}
          >
            ✕
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  closeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
