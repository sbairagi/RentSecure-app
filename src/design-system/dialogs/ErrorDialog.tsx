import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';

export interface ErrorDialogProps {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onButtonPress: () => void;
  style?: ViewStyle;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  visible,
  title,
  message,
  buttonLabel = 'Try Again',
  onButtonPress,
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onButtonPress}>
      <Pressable style={styles.overlay} onPress={onButtonPress}>
        <Pressable style={[styles.dialog, { backgroundColor: theme.colors.neutral[50] }, style]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.error[100] }]}>
            <Text style={[styles.icon, { color: theme.colors.error[600] }]}>✕</Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.neutral[900] }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.colors.neutral[600] }]}>{message}</Text>
          <Pressable
            style={[styles.button, { backgroundColor: theme.colors.error[600] }]}
            onPress={onButtonPress}
          >
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
    elevation: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 32,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.md,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
