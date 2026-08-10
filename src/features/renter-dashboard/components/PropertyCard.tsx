import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { RenterProfile } from '../../types/renterDashboard';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface PropertyCardProps {
  profile: RenterProfile;
  onPress?: () => void;
}

export function PropertyCard({ profile, onPress }: PropertyCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(drawer)/(tabs)/search');
    }
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.header}>
        <Avatar.Text
          size={40}
          label={profile.name.charAt(0).toUpperCase()}
          style={{ backgroundColor: theme.colors.primaryContainer }}
          labelStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 16 }}
        />
        <View style={styles.headerText}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            {profile.unit.unit}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {profile.building?.name || 'Unknown Property'}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Unit Type
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
            {profile.unit.unit_type || 'N/A'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Address
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '500', textAlign: 'right', flex: 1 }}>
            {[profile.unit.address_line, profile.unit.city, profile.unit.state, profile.unit.postal_code].filter(Boolean).join(', ') || 'N/A'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Status
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: profile.status === 'active'
                  ? `${theme.colors.primary}15`
                  : profile.status === 'notice_period'
                    ? `${theme.colors.tertiary}15`
                    : `${theme.colors.error}15`,
              },
            ]}
          >
            <Text
              variant="bodySmall"
              style={{
                color: profile.status === 'active'
                  ? theme.colors.primary
                  : profile.status === 'notice_period'
                    ? theme.colors.tertiary
                    : theme.colors.error,
                fontWeight: '600',
              }}
            >
              {profile.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
});