import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  style?: ViewStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const Carousel: React.FC<CarouselProps> = ({
  items,
  _autoPlay = false,
  _interval = 3000,
  showDots = true,
  style,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const _scrollViewRef = useRef<View>(null);
  const theme = useDesignSystemTheme();

  const _handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  }, []);

  return (
    <View style={style}>
      <View style={styles.slider}>
        <View
          style={[
            styles.slidesContainer,
            { transform: [{ translateX: -currentIndex * SCREEN_WIDTH }] },
          ]}
        >
          {items.map((item, index) => (
            <View key={index} style={[styles.slide, { width: SCREEN_WIDTH }]}>
              {item}
            </View>
          ))}
        </View>
      </View>
      {showDots && items.length > 1 && (
        <View style={styles.dotsContainer}>
          {items.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? theme.colors.primary[600] : theme.colors.neutral[300],
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  slider: {
    overflow: 'hidden',
  },
  slidesContainer: {
    flexDirection: 'row',
  },
  slide: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
