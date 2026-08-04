import React from 'react';
import { StyleSheet, Text, TouchableOpacity, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface ImagePickerProps {
  onSelect: (uri: string) => void;
  buttonLabel?: string;
  style?: ViewStyle;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onSelect,
  buttonLabel = 'Pick Image',
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: theme.colors.neutral[200] }, style]}
      onPress={() => onSelect('placeholder://image')}
    >
      <Text style={[styles.icon, { color: theme.colors.neutral[400] }]}>📷</Text>
      <Text style={[styles.label, { color: theme.colors.primary[600] }]}>{buttonLabel}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderStyle: 'dashed',
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
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
