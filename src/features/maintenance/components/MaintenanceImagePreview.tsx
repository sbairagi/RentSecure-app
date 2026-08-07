import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface MaintenanceImagePreviewProps {
  _uri: string;
  _onPress?: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const MaintenanceImagePreview: React.FC<MaintenanceImagePreviewProps> = ({
  _uri,
  _onPress,
  onRemove,
  showRemove = false,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={_onPress}>
        <View style={[styles.placeholder, { backgroundColor: theme.border }]}>
          <Text style={styles.placeholderIcon}>🖼️</Text>
        </View>
      </TouchableOpacity>
      {showRemove && onRemove && (
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
