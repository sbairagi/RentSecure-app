import React from 'react';
import { Pressable, Text, type TextStyle, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface TextButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  textStyle?: TextStyle;
  style?: ViewStyle;
  testID?: string;
}

export const TextButton: React.FC<TextButtonProps> = ({
  title,
  onPress,
  disabled = false,
  textStyle,
  style,
  testID,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      testID={testID}
    >
      <Text
        style={[
          styles.text,
          { color: theme.colors.primary[600] },
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

TextButton.displayName = 'TextButton';

const styles = {
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
  } as ViewStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,
  pressed: {
    opacity: 0.8,
  } as ViewStyle,
  text: {
    fontSize: 14,
    fontWeight: '500',
  } as TextStyle,
  disabledText: {
    color: '#9CA3AF',
  } as TextStyle,
};
