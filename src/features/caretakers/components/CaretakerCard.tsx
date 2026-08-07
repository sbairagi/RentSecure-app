import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '@/design-system/theme';
import { Card } from '@/design-system/cards/Card';
import { colors, radius, spacing } from '@/design-system/tokens';

export interface CaretakerCardProps {
  name: string;
  phone: string;
  email: string;
  unitName?: string;
  isActive: boolean;
  joiningDate: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const statusConfig = {
  active: { color: colors.success[500], bg: colors.success[100], label: 'Active' },
  inactive: { color: colors.error[500], bg: colors.error[100], label: 'Inactive' },
};

export const CaretakerCard: React.FC<CaretakerCardProps> = ({
  name,
  phone,
  email,
  unitName,
  isActive,
  joiningDate,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const statusInfo = statusConfig[isActive ? 'active' : 'inactive'];

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
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.colors.neutral[500] }]}>Phone</Text>
          <Text style={[styles.detailValue, { color: theme.colors.neutral[900] }]}>{phone}</Text>
        </View>
        {unitName && (
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.neutral[500] }]}>Unit</Text>
            <Text style={[styles.detailValue, { color: theme.colors.neutral[900] }]}>{unitName}</Text>
          </View>
        )}
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.colors.neutral[500] }]}>Joined</Text>
          <Text style={[styles.detailValue, { color: theme.colors.neutral[900] }]}>
            {new Date(joiningDate).toLocaleDateString()}
          </Text>
        </View>
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
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
  },
});
