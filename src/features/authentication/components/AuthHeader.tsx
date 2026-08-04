import { FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    opacity: 0.7,
    lineHeight: 22,
  },
});
