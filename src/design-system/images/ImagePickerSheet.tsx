import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';

export interface ImagePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectGallery: () => void;
  title?: string;
}

export const ImagePickerSheet: React.FC<ImagePickerSheetProps> = ({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
  title = 'Select Image',
}) => {
  const theme = useDesignSystemTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.colors.neutral[50] }]}>
          <View style={styles.handle} />
          <Text style={[styles.title, { color: theme.colors.neutral[900] }]}>{title}</Text>
          <Pressable
            style={[styles.option, { backgroundColor: theme.colors.neutral[100] }]}
            onPress={() => {
              onSelectCamera();
              onClose();
            }}
          >
            <Text style={styles.optionIcon}>📷</Text>
            <Text style={[styles.optionText, { color: theme.colors.neutral[900] }]}>Camera</Text>
          </Pressable>
          <Pressable
            style={[styles.option, { backgroundColor: theme.colors.neutral[100] }]}
            onPress={() => {
              onSelectGallery();
              onClose();
            }}
          >
            <Text style={styles.optionIcon}>🖼️</Text>
            <Text style={[styles.optionText, { color: theme.colors.neutral[900] }]}>Gallery</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral[300],
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: 0.25,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
