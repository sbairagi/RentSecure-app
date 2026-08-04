import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, spacing } from '../tokens';
import { Card } from './Card';

export interface NotificationCardProps {
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const typeConfig = {
  info: { color: colors.info[500], bg: colors.info[100], icon: 'ℹ️' },
  success: { color: colors.success[500], bg: colors.success[100], icon: '✓' },
  warning: { color: colors.warning[500], bg: colors.warning[100], icon: '⚠' },
  error: { color: colors.error[500], bg: colors.error[100], icon: '✕' },
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  timestamp,
  type,
  read = false,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const typeInfo = typeConfig[type];

  return (
    <Card
      onPress={onPress}
      style={[style, !read && { borderLeftWidth: 3, borderLeftColor: typeInfo.color }]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: typeInfo.bg }]}>
          <Text style={[styles.icon, { color: typeInfo.color }]}>{typeInfo.icon}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: theme.colors.neutral[900] }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.timestamp, { color: theme.colors.neutral[400] }]}>{timestamp}</Text>
        </View>
      </View>
      <Text style={[styles.message, { color: theme.colors.neutral[600] }]} numberOfLines={2}>
        {message}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
});
