import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';

interface RentSkeletonLoaderProps {
  count?: number;
}

export const RentSkeletonLoader: React.FC<RentSkeletonLoaderProps> = ({ count = 5 }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} style={[styles.card, { backgroundColor: theme.cardSkeleton }]}>
          <Card.Content>
            <View style={styles.headerSkeleton}>
              <View style={styles.titleSkeleton} />
              <View style={styles.badgeSkeleton} />
            </View>
            <View style={styles.amountSkeleton} />
            <View style={styles.metaSkeleton}>
              <View style={styles.metaItemSkeleton} />
              <View style={styles.metaItemSkeleton} />
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Spacing.md,
  },
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: 12,
  },
  headerSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  titleSkeleton: {
    width: '60%',
    height: 16,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  badgeSkeleton: {
    width: 80,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  amountSkeleton: {
    width: '40%',
    height: 24,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginBottom: Spacing.sm,
  },
  metaSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  metaItemSkeleton: {
    width: '30%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
});
