import { FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SuccessAnimationProps {
  message: string;
  onComplete?: () => void;
  duration?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  message,
  onComplete,
  duration = 2000,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.7)) }),
      withTiming(1, { duration: 300 })
    );
    opacity.value = withTiming(1, { duration: 300 });
    checkmarkScale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });

    if (onComplete) {
      const timer = setTimeout(() => {
        runOnJS(onComplete)();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: checkmarkScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { backgroundColor: theme.success }, circleStyle]}>
        <Animated.View style={checkmarkStyle}>
          <Text style={[styles.checkmark, { color: theme.surface }]}>&#10003;</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[{ marginTop: Spacing.lg }, textStyle]}>
        <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 48,
    fontWeight: FontWeights.bold,
  },
  message: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
});
