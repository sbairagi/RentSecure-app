import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  style?: ViewStyle;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', style }) => {
  const [visible, setVisible] = useState(false);
  const theme = useDesignSystemTheme();

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPressIn={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
        style={style}
      >
        {children}
      </Pressable>
      {visible && (
        <View
          style={[
            styles.tooltip,
            {
              backgroundColor: theme.colors.neutral[800],
              ...(position === 'top' && { bottom: '100%', marginBottom: 8 }),
              ...(position === 'bottom' && { top: '100%', marginTop: 8 }),
              ...(position === 'left' && { right: '100%', marginRight: 8 }),
              ...(position === 'right' && { left: '100%', marginLeft: 8 }),
            },
          ]}
        >
          <Text style={[styles.tooltipText, { color: colors.white }]}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    zIndex: 999,
    maxWidth: 200,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
