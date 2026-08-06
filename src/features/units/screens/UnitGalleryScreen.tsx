import { Spacing } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UnitGallery } from '../components/UnitGallery';
import { useUnitImages } from '../hooks/useUnitImages';

export default function UnitGalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { images, isLoading } = useUnitImages(Number(id));

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.loadingText}>Loading gallery...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <Text style={styles.headerTitle}>Unit Gallery</Text>
        <Text style={styles.count}>{images.length} images</Text>
      </View>
      <View style={styles.content}>
        <UnitGallery images={images} onImagePress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  count: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
});
