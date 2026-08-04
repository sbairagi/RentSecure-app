import React from 'react';
import { StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface TextAreaProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  containerStyle?: ViewStyle;
  numberOfLines?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChangeText,
  placeholder = 'Enter text...',
  error,
  maxLength = 500,
  containerStyle,
  numberOfLines = 4,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.colors.neutral[700] }]}>{label}</Text>}
      <TextInput
        style={[
          styles.textArea,
          {
            borderColor: error ? theme.colors.error[500] : theme.colors.neutral[200],
            backgroundColor: theme.colors.neutral[50],
            color: theme.colors.neutral[900],
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.neutral[400]}
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        textAlignVertical="top"
      />
      {error && <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>{error}</Text>}
    </View>
  );
};

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
  textArea: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    minHeight: 100,
  },
  errorText: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
