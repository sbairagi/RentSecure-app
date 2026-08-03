import { Colors, FontSizes, FontWeights } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface AvatarProps {
  name?: string;
  _uri?: string;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'U',
  _uri,
  size = 'medium',
  onPress,
  style,
}) => {
  const theme = useTheme();

  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      default:
        return 48;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return FontSizes.sm;
      case 'medium':
        return FontSizes.md;
      case 'large':
        return FontSizes.xl;
      default:
        return FontSizes.md;
    }
  };

  const avatarSize = getSize();
  const fontSize = getFontSize();

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      style={[
        styles.avatar,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: theme.primary,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: Colors.white,
            fontSize,
            fontWeight: FontWeights.bold,
            lineHeight: avatarSize,
          },
        ]}
      >
        {name.charAt(0).toUpperCase()}
      </Text>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    textAlign: 'center',
  },
});
