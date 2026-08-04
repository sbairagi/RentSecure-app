import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onToggle: () => void;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onToggle,
  error,
  disabled = false,
  containerStyle,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        containerStyle,
        pressed && !disabled && { opacity: 0.8 },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: error
              ? theme.colors.error[500]
              : checked
                ? theme.colors.primary[600]
                : theme.colors.neutral[300],
            backgroundColor: checked ? theme.colors.primary[600] : theme.colors.neutral[50],
          },
        ]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            { color: disabled ? theme.colors.neutral[400] : theme.colors.neutral[700] },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.xs,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
});
