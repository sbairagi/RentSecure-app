import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface RadioProps {
  label?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  selected,
  onSelect,
  disabled = false,
  containerStyle,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        containerStyle,
        pressed && !disabled && { opacity: 0.8 },
      ]}
    >
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? theme.colors.primary[600] : theme.colors.neutral[300],
          },
        ]}
      >
        {selected && <View style={[styles.dot, { backgroundColor: theme.colors.primary[600] }]} />}
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
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
});
