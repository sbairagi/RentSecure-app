import { Colors, FontSizes, FontWeights, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  style?: ViewStyle;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  style,
}) => {
  const theme = useTheme();

  useEffect(() => {
    if (visible) {
      console.log('Modal opened');
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.container, { backgroundColor: theme.surface }, style]}>
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && <Text style={[styles.title, { color: theme.text }]}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={[styles.closeText, { color: theme.textSecondary }]}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black + '80',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  closeText: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  content: {
    maxHeight: '90%',
  },
});
