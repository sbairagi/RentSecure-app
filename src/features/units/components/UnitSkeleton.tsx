import { Skeleton } from '@/components/ui/Skeleton';
import { Spacing } from '@/constants/theme';
import React from 'react';
import { View } from 'react-native';

export const UnitSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View style={{ padding: Spacing.md }}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: Spacing.md,
            marginBottom: Spacing.sm,
          }}
        >
          <Skeleton _width="60%" _height={20} _style={{ marginBottom: 8 }} />
          <Skeleton _width="40%" _height={14} _style={{ marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Skeleton _width={80} _height={14} />
            <Skeleton _width={120} _height={14} />
          </View>
        </View>
      ))}
    </View>
  );
};
