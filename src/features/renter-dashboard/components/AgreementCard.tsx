import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { RenterAgreement } from '../../types/renterDashboard';

interface AgreementCardProps {
  agreement: RenterAgreement;
  onPress?: () => void;
}

export function AgreementCard({ agreement, onPress }: AgreementCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(drawer)/(tabs)/agreements');
    }
  };

  const isSigned = agreement.owner_signed && agreement.renter_signed;
  const startDate = agreement.generated_at
    ? new Date(agreement.generated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <Animated.View
      onTouchEnd={handlePress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
          Rental Agreement
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isSigned
                ? `${theme.colors.primary}15`
                : `${theme.colors.tertiary}15`,
            },
          ]}
        >
          <Text
            variant="bodySmall"
            style={{
              color: isSigned ? theme.colors.primary : theme.colors.tertiary,
              fontWeight: '600',
            }}
          >
            {isSigned ? 'SIGNED' : 'PENDING'}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Unit
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
            {agreement.unit_name || 'N/A'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Generated
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
            {startDate}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Owner Signed
          </Text>
          <Text variant="bodySmall" style={{ color: agreement.owner_signed ? theme.colors.primary : theme.colors.error, fontWeight: '500' }}>
            {agreement.owner_signed ? 'Yes' : 'No'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            You Signed
          </Text>
          <Text variant="bodySmall" style={{ color: agreement.renter_signed ? theme.colors.primary : theme.colors.error, fontWeight: '500' }}>
            {agreement.renter_signed ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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