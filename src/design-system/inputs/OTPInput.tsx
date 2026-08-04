import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export const OTPInput = forwardRef<TextInput, OTPInputProps>(
  ({ length = 4, value, onChange, error, containerStyle }, ref) => {
    const theme = useDesignSystemTheme();

    const handleChange = (text: string) => {
      const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
      onChange(cleaned);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.otpContainer}>
          {Array.from({ length }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.cell,
                {
                  borderColor: error ? theme.colors.error[500] : theme.colors.neutral[200],
                  backgroundColor: theme.colors.neutral[50],
                },
              ]}
            >
              <Text style={[styles.cellText, { color: theme.colors.neutral[900] }]}>
                {value[index] || ''}
              </Text>
            </View>
          ))}
        </View>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={handleChange}
          keyboardType="numeric"
          maxLength={length}
          style={styles.hiddenInput}
          textContentType="oneTimeCode"
        />
        {error && (
          <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>{error}</Text>
        )}
      </View>
    );
  }
);

OTPInput.displayName = 'OTPInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cell: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 20,
    fontWeight: '700',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorText: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
