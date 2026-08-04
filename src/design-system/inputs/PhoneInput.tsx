import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface PhoneInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  value,
  _onChangeText,
  error,
  containerStyle,
}) => {
  const theme = useDesignSystemTheme();

  const _formatPhone = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    return cleaned.slice(0, 15);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.colors.neutral[700] }]}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: error ? theme.colors.error[500] : theme.colors.neutral[200],
            backgroundColor: theme.colors.neutral[50],
          },
        ]}
      >
        <Text style={[styles.prefix, { color: theme.colors.neutral[500] }]}>+1</Text>
        <Text style={[styles.input, { color: theme.colors.neutral[900] }]}>{value}</Text>
      </View>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  prefix: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: 14,
  },
  errorText: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
