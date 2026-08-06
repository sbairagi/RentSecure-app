import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UnitGalleryProps {
  images: { id: number; image: string }[];
  onImagePress: (index: number) => void;
}

export const UnitGallery: React.FC<UnitGalleryProps> = ({ images, onImagePress }) => {
  const theme = useTheme();

  if (images.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.emptyText, { color: theme.subText }]}>No images uploaded</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {images.slice(0, 5).map((image, index) => (
        <View key={image.id} style={styles.imageContainer}>
          <Text style={styles.imageText}>Image {index + 1}</Text>
        </View>
      ))}
      {images.length > 5 && (
        <View style={[styles.moreContainer, { backgroundColor: theme.primary }]}>
          <Text style={styles.moreText}>+{images.length - 5}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
