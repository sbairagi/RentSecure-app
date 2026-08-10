import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface MaintenanceSummaryProps {
  count: number;
  onPress?: () => void;
}

export function MaintenanceSummary({ count, onPress }: MaintenanceSummaryProps) {
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(drawer)/(tabs)/maintenance');
    }
  };

  return (
    <Animated.View
      onTouchEnd={handlePress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.content}>
        <View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            Maintenance & Extra Charges
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
            {count} pending {count === 1 ? 'charge' : 'charges'}
          </Text>
        </View>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${theme.colors.tertiary}15` },
          ]}
        >
          <Text style={{ fontSize: 24 }}>🔧</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});