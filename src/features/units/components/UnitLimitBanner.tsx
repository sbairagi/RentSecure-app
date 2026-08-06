import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUnitSubscriptionLimits } from '../hooks/useUnitSubscriptionLimits';

export const UnitLimitBanner: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { limits, isLoading } = useUnitSubscriptionLimits();

  if (isLoading || !limits) {
    return null;
  }

  const isAtLimit = limits.max_units !== 'unlimited' && limits.current_units >= limits.max_units;

  if (!isAtLimit) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: '#fef3c7' }]}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Unit Limit Reached</Text>
          <Text style={styles.description}>
            You have used {limits.current_units} of {limits.max_units} units. Upgrade your plan to
            add more.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.upgradeButton, { backgroundColor: '#d97706' }]}
        onPress={() => router.push('/(drawer)/(tabs)/subscription')}
      >
        <Text style={styles.upgradeButtonText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#a16207',
  },
  upgradeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
