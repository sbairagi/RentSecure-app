import React from 'react';
import { StyleSheet, Text, TouchableOpacity, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface DocumentPickerProps {
  onSelect: (uri: string) => void;
  buttonLabel?: string;
  allowedTypes?: string[];
  style?: ViewStyle;
}

export const DocumentPicker: React.FC<DocumentPickerProps> = ({
  onSelect,
  buttonLabel = 'Pick Document',
  allowedTypes = ['pdf', 'doc', 'docx'],
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: theme.colors.neutral[200] }, style]}
      onPress={() => onSelect('placeholder://document')}
    >
      <Text style={styles.icon}>📄</Text>
      <Text style={[styles.label, { color: theme.colors.primary[600] }]}>{buttonLabel}</Text>
      <Text style={[styles.hint, { color: theme.colors.neutral[400] }]}>
        {allowedTypes.join(', ')}
      </Text>
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
    gap: spacing.sm,
  },
  icon: {
    fontSize: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
  },
});
