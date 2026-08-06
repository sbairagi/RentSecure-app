import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { RenterSkeletonLoaderProps } from '../types';

const SkeletonBlock: React.FC<{ width: string | number; height: number; style?: any }> = ({
  width,
  height,
  style,
}) => {
  const theme = useTheme();
  return (
    <View style={[{ width, height, backgroundColor: theme.border, borderRadius: 4 }, style]} />
  );
};

export const RenterSkeletonLoader: React.FC<RenterSkeletonLoaderProps> = ({ type = 'list' }) => {
  const theme = useTheme();

  if (type === 'detail') {
    return (
      <View style={{ padding: Spacing.md }}>
        <View style={styles.detailHeader}>
          <SkeletonBlock width={80} height={80} style={{ borderRadius: 40 }} />
          <View style={styles.detailInfo}>
            <SkeletonBlock width="60%" height={24} style={{ marginBottom: 8 }} />
            <SkeletonBlock width="40%" height={16} />
            <SkeletonBlock width="30%" height={16} style={{ marginTop: 4 }} />
          </View>
        </View>
        {Array.from({ length: 3 }).map((_, index) => (
          <View
            key={index}
            style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <SkeletonBlock width="40%" height={18} style={{ marginBottom: 12 }} />
            <SkeletonBlock width="100%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonBlock width="80%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonBlock width="60%" height={16} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={{ padding: Spacing.md }}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View
          key={index}
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <View style={styles.cardHeader}>
            <SkeletonBlock
              width={48}
              height={48}
              style={{ borderRadius: 24, marginRight: Spacing.sm }}
            />
            <View style={styles.cardInfo}>
              <SkeletonBlock width="60%" height={18} style={{ marginBottom: 6 }} />
              <SkeletonBlock width="40%" height={14} />
            </View>
            <SkeletonBlock width={80} height={28} style={{ borderRadius: 6 }} />
          </View>
          <View style={styles.cardDetails}>
            <SkeletonBlock width="30%" height={14} style={{ marginRight: Spacing.lg }} />
            <SkeletonBlock width="25%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardInfo: {
    flex: 1,
  },
  cardDetails: {
    flexDirection: 'row',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  detailInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  section: {
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
});
