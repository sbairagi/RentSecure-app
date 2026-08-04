import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  ({ label, error, containerStyle, ...rest }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const theme = useDesignSystemTheme();

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
          <TextInput
            ref={ref}
            style={[styles.input, { color: theme.colors.neutral[900] }]}
            placeholderTextColor={theme.colors.neutral[400]}
            secureTextEntry={!isVisible}
            {...rest}
          />
          <Pressable onPress={() => setIsVisible(!isVisible)} style={styles.iconButton}>
            <Text style={[styles.iconText, { color: theme.colors.neutral[500] }]}>
              {isVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        </View>
        {error && (
          <Text style={[styles.errorText, { color: theme.colors.error[500] }]}>{error}</Text>
        )}
      </View>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

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
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    fontSize: 14,
  },
  iconButton: {
    padding: spacing.xs,
  },
  iconText: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
