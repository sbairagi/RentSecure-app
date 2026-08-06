import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Image } from 'expo-image';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RenterCardProps } from '../types';

const RENTER_STATUS_COLORS: Record<string, string> = {
  active: '#16a34a',
  notice_period: '#d97706',
  revoked: '#dc2626',
  deactivated: '#6b7280',
};

const RENTER_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  notice_period: 'Notice Period',
  revoked: 'Revoked',
  deactivated: 'Deactivated',
};

export const RenterCard: React.FC<RenterCardProps> = ({ renter, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${renter.name}, ${RENTER_STATUS_LABELS[renter.status]}`}
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {renter.photo ? (
            <Image
              source={{ uri: renter.photo }}
              style={styles.avatar}
              contentFit="cover"
              accessible
              accessibilityRole="image"
              accessibilityLabel={`${renter.name} photo`}
            />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>{renter.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]}>{renter.name}</Text>
            <Text style={[styles.phone, { color: theme.subText }]}>{renter.phone}</Text>
          </View>
          <View
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Status: ${RENTER_STATUS_LABELS[renter.status]}`}
            style={[styles.badge, { backgroundColor: RENTER_STATUS_COLORS[renter.status] + '20' }]}
          >
            <Text style={[styles.badgeText, { color: RENTER_STATUS_COLORS[renter.status] }]}>
              {RENTER_STATUS_LABELS[renter.status]}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.subText }]}>Unit:</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {renter.unit_name || renter.current_unit
              ? `Unit ${renter.unit_name || String(renter.current_unit)}`
              : 'Not assigned'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme.subText }]}>Rent:</Text>
          <Text style={[styles.value, { color: theme.text }]}>₹{renter.rent_amount}</Text>
        </View>
      </View>
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Text style={[styles.date, { color: theme.subText }]}>
          Since {new Date(renter.start_date).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacing.sm,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  phone: {
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  footer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  date: {
    fontSize: 12,
  },
});

export default memo(RenterCard);
