import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface CaretakerLimitBannerProps {
  limit?: number;
  currentUsage?: number;
}

export const CaretakerLimitBanner: React.FC<CaretakerLimitBannerProps> = ({
  limit = 1,
  currentUsage = 0,
}) => {
  const theme = useTheme();
  const isLimitReached = limit !== -1 && currentUsage >= limit;

  if (!isLimitReached) return null;

  return (
    <View style={[styles.container, { backgroundColor: '#FFFBEB' }]}>
      <Text style={[styles.icon, { color: theme.warning }]}>⚠️</Text>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: '#D97706' }]}>
          Caretaker Limit Reached
        </Text>
        <Text style={[styles.description, { color: '#D97706' }]}>
          You have reached your plan limit of {limit} caretaker{limit !== 1 ? 's' : ''}. Upgrade to
          add more.
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
    borderRadius: 10,
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
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
});
