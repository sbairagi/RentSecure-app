import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, spacing } from '../tokens';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  onBack,
  showBack = false,
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral[50] }, style]}>
      <View style={styles.left}>
        {showBack && onBack && (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.colors.primary[600] }]}>← Back</Text>
          </Pressable>
        )}
        {leftAction}
      </View>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.neutral[900] }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.neutral[500] }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.right}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 80,
  },
  backButton: {
    padding: spacing.xs,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
