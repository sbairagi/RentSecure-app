import { Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import type { FeatureLimitBannerProps } from '../types';

export const FeatureLimitBanner: React.FC<FeatureLimitBannerProps> = ({
  currentUsage,
  limit,
  featureName,
  onUpgrade,
}) => {
  const isAtLimit = limit !== 'unlimited' && currentUsage >= limit;
  const isNearLimit = limit !== 'unlimited' && currentUsage >= limit * 0.8;

  if (!isAtLimit && !isNearLimit) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: isAtLimit ? '#fef3c7' : '#fef9c3' }]}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: isAtLimit ? '#92400e' : '#a16207' }]}>
            {isAtLimit ? `${featureName} Limit Reached` : `Approaching ${featureName} Limit`}
          </Text>
          <Text style={[styles.description, { color: '#a16207' }]}>
            {isAtLimit
              ? `You have used ${currentUsage} of ${limit} ${featureName.toLowerCase()}. Upgrade your plan to add more.`
              : `You have used ${currentUsage} of ${limit} ${featureName.toLowerCase()}. Consider upgrading your plan.`}
          </Text>
        </View>
      </View>
      <Button
        mode="contained"
        onPress={onUpgrade}
        style={[styles.button, { backgroundColor: '#d97706' }]}
        labelStyle={{ color: Colors.white }}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Upgrade plan"
      >
        Upgrade
      </Button>
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
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
