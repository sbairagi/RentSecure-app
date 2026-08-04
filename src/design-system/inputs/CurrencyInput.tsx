import React from 'react';
import { StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface CurrencyInputProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  currency?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChangeText,
  currency = '$',
  error,
  containerStyle,
}) => {
  const theme = useDesignSystemTheme();

  const formatCurrency = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    return cleaned;
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
        <Text style={[styles.currency, { color: theme.colors.neutral[500] }]}>{currency}</Text>
        <TextInput
          style={[styles.input, { color: theme.colors.neutral[900] }]}
          placeholder="0.00"
          placeholderTextColor={theme.colors.neutral[400]}
          value={value}
          onChangeText={(text) => onChangeText(formatCurrency(text))}
          keyboardType="decimal-pad"
        />
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
  currency: {
    fontSize: 16,
    fontWeight: '600',
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
