import { View } from 'react-native';
import { SkeletonCard } from '@/components/loaders/SkeletonCard';
import { useTheme } from 'react-native-paper';

export function RenterDashboardSkeleton() {
  const theme = useTheme();

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ marginBottom: 16 }}>
        <SkeletonCard width="100%" height={120} borderRadius={16} />
      </View>
      <View style={{ marginBottom: 16 }}>
        <SkeletonCard width="100%" height={100} borderRadius={16} />
      </View>
      <View style={{ marginBottom: 16 }}>
        <SkeletonCard width="100%" height={80} borderRadius={16} />
      </View>
      <View style={{ marginBottom: 16 }}>
        <SkeletonCard width="100%" height={140} borderRadius={16} />
      </View>
      <View style={{ marginBottom: 16 }}>
        <SkeletonCard width="100%" height={100} borderRadius={16} />
      </View>
    </View>
  );
}