import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MaintenanceLimitBannerProps {
  limit?: number;
  currentUsage?: number;
}

export const MaintenanceLimitBanner: React.FC<MaintenanceLimitBannerProps> = ({
  limit,
  currentUsage,
}) => {

  // This is a placeholder - actual limit check should come from backend
  if (limit === undefined || currentUsage === undefined) {
    return null;
  }

  const isNearLimit = currentUsage >= limit * 0.8;
  const isAtLimit = currentUsage >= limit;

  if (!isNearLimit) return null;

  return (
    <View style={[styles.container, { backgroundColor: isAtLimit ? '#fef2f2' : '#fffbeb', borderColor: isAtLimit ? '#fecaca' : '#fde68a' }]}>
      <Text style={[styles.icon, { color: isAtLimit ? '#dc2626' : '#f59e0b' }]}>
        {isAtLimit ? '⚠️' : 'ℹ️'}
      </Text>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: isAtLimit ? '#dc2626' : '#b45309' }]}>
          {isAtLimit ? 'Limit Reached' : 'Approaching Limit'}
        </Text>
        <Text style={[styles.description, { color: isAtLimit ? '#dc2626' : '#b45309' }]}>
          {isAtLimit
            ? 'You have reached your maintenance request limit. Please upgrade your plan.'
            : `You have used ${currentUsage} of ${limit} maintenance requests.`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
});
