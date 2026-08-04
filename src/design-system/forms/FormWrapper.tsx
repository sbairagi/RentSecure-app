import React from 'react';
import { type ControllerProps, type FieldValues } from 'react-hook-form';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export interface FormWrapperProps<T extends FieldValues> {
  children: React.ReactNode;
  control?: ControllerProps<T>['control'];
  onSubmit: (data: T) => void;
  style?: ViewStyle;
}

export const FormWrapper = <T extends FieldValues>({
  _children,
  _control,
  _onSubmit,
  style,
}: FormWrapperProps<T>) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
