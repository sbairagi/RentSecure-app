import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: typeof Easing.linear;
  repeat?: number;
}

// Reanimated shared values are intentionally mutated inside animation hooks.
// These mutations are the expected workaround for `react-hooks/immutability`.

export function useFadeIn(config: AnimationConfig = {}) {
  const opacity = useSharedValue(0);
  const { duration = 300, delay = 0 } = config;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animate = () => {
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withDelay(delay, withTiming(1, { duration }));
  };

  const reset = () => {
    cancelAnimation(opacity);
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = 0;
  };

  return { animatedStyle, animate, reset, opacity };
}

export function useScaleIn(config: AnimationConfig = {}) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const { duration = 300, delay = 0 } = config;

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const animate = () => {
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withDelay(delay, withSpring(1));
  };

  const reset = () => {
    cancelAnimation(scale);
    cancelAnimation(opacity);
    // eslint-disable-next-line react-hooks/immutability
    scale.value = 0.8;
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = 0;
  };

  return { animatedStyle, animate, reset };
}

export function useSlideIn(
  config: AnimationConfig & { direction?: 'left' | 'right' | 'up' | 'down' } = {}
) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const { duration = 300, delay = 0, direction = 'right' } = config;

  const animatedStyle = useAnimatedStyle(() => {
    const transform: any[] = [];
    if (direction === 'left' || direction === 'right') {
      transform.push({ translateX: translateX.value as any });
    } else {
      transform.push({ translateY: translateY.value as any });
    }
    return {
      opacity: opacity.value,
      transform: transform as any,
    };
  });

  const animate = () => {
    const distance = 50;
    if (direction === 'left') {
      // eslint-disable-next-line react-hooks/immutability
      translateX.value = -distance;
    } else if (direction === 'right') {
      translateX.value = distance;
    } else if (direction === 'up') {
      // eslint-disable-next-line react-hooks/immutability
      translateY.value = -distance;
    } else {
      translateY.value = distance;
    }

    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    if (direction === 'left' || direction === 'right') {
      translateX.value = withDelay(delay, withSpring(0));
    } else {
      translateY.value = withDelay(delay, withSpring(0));
    }
  };

  const reset = () => {
    cancelAnimation(translateX);
    cancelAnimation(translateY);
    cancelAnimation(opacity);
    // eslint-disable-next-line react-hooks/immutability
    translateX.value = 0;
    // eslint-disable-next-line react-hooks/immutability
    translateY.value = 0;
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = 0;
  };

  return { animatedStyle, animate, reset };
}

export function useBounce() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animate = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withTiming(0.9, { duration: 150 }),
      withSpring(1)
    );
  };

  return { animatedStyle, animate };
}

export function useShake() {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animate = () => {
    // eslint-disable-next-line react-hooks/immutability
    translateX.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      ),
      1,
      false
    );
  };

  return { animatedStyle, animate };
}

export function useRipple() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const animate = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = 0;
    // eslint-disable-next-line react-hooks/immutability
    opacity.value = 0.5;

    scale.value = withTiming(2, { duration: 600 });

    opacity.value = withTiming(0, { duration: 600 });
  };

  return { animatedStyle, animate };
}
