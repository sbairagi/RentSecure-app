import { Spacing } from '@/constants/theme';
import { Button } from '@/design-system/buttons/Button';
import { useTheme } from '@/hooks/use-theme';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BuildingLimitBannerProps {
  featureKey?: string;
}

export const BuildingLimitBanner: React.FC<BuildingLimitBannerProps> = ({
  featureKey = 'max_buildings',
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { usageLimits, addOns } = useSubscriptionStore();

  const limit = usageLimits.find((l) => l.feature_key === featureKey);
  const hasAddOn = addOns.some((a) => a.name === featureKey && a.is_recurring);
  const currentUsage = limit?.usage_count || 0;

  if (hasAddOn) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.primary + '10' }]}>
      <Text style={[styles.text, { color: theme.text }]}>Building limit: {currentUsage} used</Text>
      <Button
        title="Upgrade"
        variant="primary"
        size="small"
        onPress={() => router.push('/(drawer)/(tabs)/subscription')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
