import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams } from 'expo-router';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as ImagePicker from 'expo-image-picker';

export default function UploadPhotosScreen() {
  const theme = useTheme();
  const _params = useLocalSearchParams<{ id: string }>();
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset: any) => asset.uri);
      setPhotos((prev) => [...prev, ...uris]);
    }
  };

  const handleUpload = async () => {
    // API call would go here with FormData
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['maintenance:write']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.photoGrid}>
            {photos.map((uri, index) => (
              <View key={index} style={styles.photoItem}>
                <View style={[styles.photoPlaceholder, { backgroundColor: theme.border }]}>
                  <Text style={styles.photoIcon}>🖼️</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={[styles.addPhotoButton, { borderColor: theme.border }]} onPress={handlePickImage}>
              <Text style={[styles.addPhotoText, { color: theme.textSecondary }]}>+ Add Photo</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.uploadButton, { backgroundColor: theme.primary }]} onPress={handleUpload}>
            <Text style={styles.uploadText}>Upload Photos</Text>
          </TouchableOpacity>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  photoItem: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoIcon: {
    fontSize: 32,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 14,
  },
  uploadButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
