import React from 'react';
import { SafeAreaView, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';

export interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children, style }) => {
  const theme = useDesignSystemTheme();

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: theme.colors.neutral[50] }, style]}>
      {children}
    </SafeAreaView>
  );
};
