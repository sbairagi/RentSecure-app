import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';

export interface ImageViewerProps {
  uri: string;
  visible: boolean;
  onClose: () => void;
  style?: ViewStyle;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ _uri, visible, onClose, style }) => {
  const theme = useDesignSystemTheme();

  if (!visible) return null;

  return (
    <View style={[styles.overlay, style]}>
      <View style={[styles.container, { backgroundColor: theme.colors.neutral[50] }]}>
        <Text style={styles.closeText} onPress={onClose}>
          ✕
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    position: 'absolute',
    top: 48,
    right: 24,
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
