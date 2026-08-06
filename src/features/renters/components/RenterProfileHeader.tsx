import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RenterProfileHeaderProps } from '../types';
import { RenterStatusBadge } from './RenterStatusBadge';

export const RenterProfileHeader: React.FC<RenterProfileHeaderProps> = ({
  renter,
  onEdit,
  onDelete,
  onVacate,
  onAssignUnit,
  onTransferUnit,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
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
            <Text style={[styles.email, { color: theme.subText }]}>{renter.email}</Text>
            <Text style={[styles.phone, { color: theme.subText }]}>{renter.phone}</Text>
            <View style={styles.badgeRow}>
              <RenterStatusBadge status={renter.status} />
              {renter.is_verified && (
                <View style={[styles.verifiedBadge, { backgroundColor: '#dcfce7' }]}>
                  <Text style={[styles.verifiedText, { color: '#16a34a' }]}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onEdit}
          style={[styles.actionButton, { backgroundColor: theme.primary + '20' }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Edit renter"
        >
          <Text style={[styles.actionText, { color: theme.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={[styles.actionButton, { backgroundColor: '#fee2e2' }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Delete renter"
        >
          <Text style={[styles.actionText, { color: '#dc2626' }]}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onVacate}
          style={[styles.actionButton, { backgroundColor: '#fef3c7' }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Vacate renter"
        >
          <Text style={[styles.actionText, { color: '#d97706' }]}>Vacate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAssignUnit}
          style={[styles.actionButton, { backgroundColor: '#dbeafe' }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Assign unit"
        >
          <Text style={[styles.actionText, { color: '#2563eb' }]}>Assign</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onTransferUnit}
          style={[styles.actionButton, { backgroundColor: '#f3e8ff' }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Transfer unit"
        >
          <Text style={[styles.actionText, { color: '#9333ea' }]}>Transfer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: Spacing.md,
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: 80,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
