import { FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  rightAction?: React.ReactNode;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  style?: ViewStyle;
  transparent?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  rightAction,
  onBackPress,
  onMenuPress,
  style,
  transparent = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const canGoBack = pathname !== '/' && pathname !== '/index';

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (canGoBack) {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.md,
          backgroundColor: transparent ? 'transparent' : theme.card,
          borderBottomColor: transparent ? 'transparent' : theme.border,
        },
        style,
      ]}
    >
      <View style={styles.left}>
        {(showBack || canGoBack) && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.iconText, { color: theme.primary }]}>←</Text>
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.iconText, { color: theme.primary }]}>☰</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        {title && (
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.right}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  iconText: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.xs,
    marginTop: 2,
    textAlign: 'center',
  },
});
