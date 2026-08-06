import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface LocationPickerProps {
  onSelect: (location: { latitude: number; longitude: number }) => void;
  style?: ViewStyle;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onSelect, style }) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, { borderColor: theme.colors.neutral[200] }, style]}>
      <Text style={[styles.icon, { color: theme.colors.neutral[400] }]}>📍</Text>
      <Text style={[styles.text, { color: theme.colors.neutral[500] }]}>
        Tap to select location
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: 14,
  },
});
