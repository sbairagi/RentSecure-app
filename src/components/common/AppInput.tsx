import { Colors, FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { forwardRef } from 'react';
import { Control, Controller, FieldError, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string | FieldError;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  control?: Control<FieldValues>;
  name?: Path<FieldValues>;
  rules?: any;
  helperText?: string;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      containerStyle,
      inputStyle,
      control,
      name,
      rules,
      helperText,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const errorMessage = typeof error === 'string' ? error : error?.message;

    const renderInput = (fieldProps: any) => (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>}
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: errorMessage ? Colors.error : theme.border,
              backgroundColor: theme.background,
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
                color: theme.text,
                fontSize: FontSizes.md,
              },
              leftIcon ? { marginLeft: 0 } : {},
              rightIcon ? { marginRight: 0 } : {},
            ]}
            placeholderTextColor={theme.textSecondary}
            {...fieldProps}
            {...rest}
          />
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
        {(errorMessage || helperText) && (
          <Text
            style={[
              styles.helperText,
              { color: errorMessage ? Colors.error : theme.textSecondary },
            ]}
          >
            {errorMessage || helperText}
          </Text>
        )}
      </View>
    );

    if (control && name) {
      return (
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({
            field: { onChange, onBlur, value, ref: fieldRef },
            fieldState: { error: _fieldError },
          }) =>
            renderInput({
              value,
              onChangeText: onChange,
              onBlur,
              ref: fieldRef,
            })
          }
        />
      );
    }

    return renderInput({});
  }
);

AppInput.displayName = 'AppInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: FontSizes.md,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  helperText: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
});
