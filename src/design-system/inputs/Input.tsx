import React, { forwardRef } from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldError,
  type FieldValues,
  Path,
} from 'react-hook-form';
import { StyleSheet, Text, TextInput, TextInputProps, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';

export interface BaseInputProps {
  label?: string;
  error?: string | FieldError;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  helperText?: string;
}

export interface RHFInputProps<T extends FieldValues> extends BaseInputProps {
  control?: ControllerProps<T>['control'];
  name?: Path<T>;
  rules?: ControllerProps<T>['rules'];
}

export const Input = forwardRef<TextInput, BaseInputProps & TextInputProps>(
  ({ label, error, leftIcon, rightIcon, containerStyle, inputStyle, helperText, ...rest }, ref) => {
    const theme = useDesignSystemTheme();
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={[styles.label, { color: theme.colors.neutral[700] }]}>{label}</Text>}
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: errorMessage ? theme.colors.error[500] : theme.colors.neutral[200],
              backgroundColor: theme.colors.neutral[50],
            },
            inputStyle,
          ]}
        >
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: theme.colors.neutral[900],
                fontSize: 14,
              },
            ]}
            placeholderTextColor={theme.colors.neutral[400]}
            {...rest}
          />
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
        {(errorMessage || helperText) && (
          <Text
            style={[
              styles.helperText,
              { color: errorMessage ? theme.colors.error[500] : theme.colors.neutral[500] },
            ]}
          >
            {errorMessage || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export function RHFInput<T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: RHFInputProps<T>) {
  if (!control || !name) return <Input {...props} />;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value, ref: fieldRef },
        fieldState: { error: _fieldError },
      }) => (
        <Input
          ref={fieldRef}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={_fieldError?.message}
          {...props}
        />
      )}
    />
  );
}

RHFInput.displayName = 'RHFInput';

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
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  helperText: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
