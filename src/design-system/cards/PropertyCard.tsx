import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';
import { Card } from './Card';

export interface PropertyCardProps {
  name: string;
  address: string;
  units: number;
  occupied: number;
  imageUrl?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  name,
  address,
  units,
  occupied,
  imageUrl,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const occupancyRate = units > 0 ? Math.round((occupied / units) * 100) : 0;

  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.neutral[900] }]} numberOfLines={1}>
          {name}
        </Text>
        <View style={[styles.badge, { backgroundColor: theme.colors.success[100] }]}>
          <Text style={[styles.badgeText, { color: theme.colors.success[700] }]}>
            {occupancyRate}% Occupied
          </Text>
        </View>
      </View>
      <Text style={[styles.address, { color: theme.colors.neutral[500] }]} numberOfLines={2}>
        {address}
      </Text>
      <View style={styles.footer}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.neutral[900] }]}>{units}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.neutral[500] }]}>Total Units</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.primary[600] }]}>{occupied}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.neutral[500] }]}>Occupied</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.colors.neutral[900] }]}>
            {units - occupied}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.neutral[500] }]}>Vacant</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  address: {
    fontSize: 13,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
