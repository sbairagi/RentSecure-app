import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';
import { Card } from './Card';

export interface CaretakerCardProps {
  name: string;
  email: string;
  phone: string;
  properties: number;
  rating: number;
  status: 'active' | 'on-leave' | 'inactive';
  onPress?: () => void;
  style?: ViewStyle;
}

const statusConfig = {
  active: { color: colors.success[500], bg: colors.success[100], label: 'Active' },
  'on-leave': { color: colors.warning[500], bg: colors.warning[100], label: 'On Leave' },
  inactive: { color: colors.error[500], bg: colors.error[100], label: 'Inactive' },
};

export const CaretakerCard: React.FC<CaretakerCardProps> = ({
  name,
  email,
  phone,
  properties,
  rating,
  status,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const statusInfo = statusConfig[status];

  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.accent[100] }]}>
          <Text style={[styles.avatarText, { color: theme.colors.accent[600] }]}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: theme.colors.neutral[900] }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.email, { color: theme.colors.neutral[500] }]} numberOfLines={1}>
            {email}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.neutral[900] }]}>{properties}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.neutral[500] }]}>Properties</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.warning[500] }]}>{rating}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.neutral[500] }]}>Rating</Text>
        </View>
        <Text style={[styles.phone, { color: theme.colors.neutral[500] }]}>{phone}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  email: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
  phone: {
    fontSize: 13,
    alignSelf: 'center',
  },
});
