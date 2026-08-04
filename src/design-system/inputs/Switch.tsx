import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, spacing } from '../tokens';

export interface SwitchProps {
  value: boolean;
  onToggle: () => void;
  label?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onToggle,
  label,
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
          styles.track,
          {
            backgroundColor: value ? theme.colors.primary[600] : theme.colors.neutral[300],
          },
        ]}
      >
        <View
          style={[
            styles.thumb,
            {
              backgroundColor: colors.white,
              transform: [{ translateX: value ? 20 : 2 }],
            },
          ]}
        />
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
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    marginLeft: spacing.sm,
    flex: 1,
  },
});
