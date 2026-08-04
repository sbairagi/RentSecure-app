import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Button } from '../buttons';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';

export interface ActionSheetProps {
  visible: boolean;
  title?: string;
  items: { label: string; onPress: () => void; destructive?: boolean; disabled?: boolean }[];
  onClose: () => void;
  cancelLabel?: string;
  style?: ViewStyle;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  title,
  items,
  onClose,
  cancelLabel = 'Cancel',
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.colors.neutral[50] }, style]}>
          <View style={styles.handle} />
          {title && (
            <Text style={[styles.title, { color: theme.colors.neutral[900] }]}>{title}</Text>
          )}
          <View style={styles.itemsContainer}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.item, { backgroundColor: theme.colors.neutral[100] }]}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
                disabled={item.disabled}
              >
                <Text
                  style={[
                    styles.itemText,
                    {
                      color: item.destructive ? theme.colors.error[500] : theme.colors.neutral[900],
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            title={cancelLabel}
            variant="ghost"
            size="medium"
            onPress={onClose}
            style={styles.cancelButton}
          />
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
  itemsContainer: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  item: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
});
