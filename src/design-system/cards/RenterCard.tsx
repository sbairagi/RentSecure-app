import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';
import { Card } from './Card';

export interface RenterCardProps {
  name: string;
  email: string;
  phone: string;
  unit?: string;
  status: 'active' | 'pending' | 'inactive';
  avatarUrl?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const statusConfig = {
  active: { color: colors.success[500], bg: colors.success[100], label: 'Active' },
  pending: { color: colors.warning[500], bg: colors.warning[100], label: 'Pending' },
  inactive: { color: colors.error[500], bg: colors.error[100], label: 'Inactive' },
};

export const RenterCard: React.FC<RenterCardProps> = ({
  name,
  email,
  phone,
  unit,
  status,
  _avatarUrl,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const statusInfo = statusConfig[status];

  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary[100] }]}>
          <Text style={[styles.avatarText, { color: theme.colors.primary[600] }]}>
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
      <View style={styles.footer}>
        <Text style={[styles.phone, { color: theme.colors.neutral[500] }]}>{phone}</Text>
        {unit && <Text style={[styles.unit, { color: theme.colors.neutral[400] }]}>{unit}</Text>}
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  phone: {
    fontSize: 13,
  },
  unit: {
    fontSize: 13,
  },
});
