import { Colors, FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  style?: ViewStyle;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onApplePress,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        <Text style={[styles.dividerText, { color: theme.textSecondary }]}>Or continue with</Text>
        <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { borderColor: theme.border, backgroundColor: theme.background },
          ]}
          onPress={onGooglePress}
          activeOpacity={0.8}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={[styles.socialButtonText, { color: theme.text }]}>Google</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[
              styles.socialButton,
              { borderColor: theme.border, backgroundColor: theme.background },
            ]}
            onPress={onApplePress}
            activeOpacity={0.8}
          >
            <Text style={styles.appleIcon}>&#63743;</Text>
            <Text style={[styles.socialButtonText, { color: theme.text }]}>Apple</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    cursor: 'pointer',
  },
  googleIcon: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: '#4285F4',
    marginRight: Spacing.sm,
  },
  appleIcon: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.black,
    marginRight: Spacing.sm,
  },
  socialButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
});
