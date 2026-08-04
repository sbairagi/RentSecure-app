import React from 'react';
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';

export interface AvatarProps {
  source?: { uri?: string };
  name?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const sizeConfig = {
  small: { size: 32, fontSize: 14 },
  medium: { size: 40, fontSize: 16 },
  large: { size: 56, fontSize: 20 },
};

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '',
  size = 'medium',
  style,
  textStyle,
}) => {
  const theme = useDesignSystemTheme();
  const { size: avatarSize, fontSize } = sizeConfig[size];
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <View
      style={[
        styles.avatar,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: theme.colors.primary[100],
        },
        style,
      ]}
    >
      {source?.uri ? (
        <Text style={[styles.text, { fontSize, color: theme.colors.primary[600] }, textStyle]}>
          {initials}
        </Text>
      ) : (
        <Text style={[styles.text, { fontSize, color: theme.colors.primary[600] }, textStyle]}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontWeight: '700',
  },
});
