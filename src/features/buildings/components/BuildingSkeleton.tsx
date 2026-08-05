import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export const BuildingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  const theme = useTheme();
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
          ]}
        >
          <View style={[styles.shimmer, { backgroundColor: theme.colors.outlineVariant }]} />
          <View style={[styles.shimmerSmall, { backgroundColor: theme.colors.outlineVariant }]} />
          <View style={[styles.shimmerMedium, { backgroundColor: theme.colors.outlineVariant }]} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 140,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  shimmer: {
    height: 20,
    borderRadius: 8,
    width: '60%',
    marginBottom: 12,
  },
  shimmerSmall: {
    height: 12,
    borderRadius: 6,
    width: '40%',
    marginBottom: 8,
  },
  shimmerMedium: {
    height: 16,
    borderRadius: 8,
    width: '80%',
    marginBottom: 12,
  },
});
