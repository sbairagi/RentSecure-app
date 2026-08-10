import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Title, Button, HelperText } from 'react-native-paper';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { UploadProgress } from '../components/UploadProgress';
import { DOCUMENT_CONSTANTS } from '../constants/documents';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { documentHelpers } from '../utils/documentHelpers';

type PickerMode = 'document' | 'image';

export default function DocumentUploadScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedAsset, setSelectedAsset] = useState<{ uri: string; name: string; size?: number; mimeType?: string; mode: PickerMode } | null>(null);
  const { upload, isUploading, resetProgress } = useUploadDocument();

  const requestPermission = async (mode: PickerMode) => {
    if (mode === 'image') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return false;
      }
    }
    return true;
  };

  const handlePickDocument = async () => {
    setPickerMode('document');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [...DOCUMENT_CONSTANTS.ALLOWED_MIME_TYPES],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const mimeType = asset.mimeType || 'application/octet-stream';
        if (!DOCUMENT_CONSTANTS.ALLOWED_MIME_TYPES.includes(mimeType as any)) {
          alert('File type not supported.');
          return;
        }
        setSelectedAsset({
          uri: asset.uri,
          name: asset.name,
          size: asset.size,
          mimeType,
          mode: 'document',
        });
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  };

  const handlePickImage = async () => {
    const granted = await requestPermission('image');
    if (!granted) return;
    setPickerMode('image');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const mimeType = asset.mimeType || 'image/jpeg';
        setSelectedAsset({
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          size: asset.fileSize,
          mimeType,
          mode: 'image',
        });
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedAsset) return;

    const unitId = 1; // In a real app, get from selected unit context
    try {
      await upload.mutateAsync({
        asset: {
          uri: selectedAsset.uri,
          name: selectedAsset.name,
          mimeType: selectedAsset.mimeType,
          size: selectedAsset.size,
          type: selectedAsset.mode,
        },
        unit: unitId,
      });
      setSelectedAsset(null);
      router.back();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Title style={[styles.title, { color: theme.text }]}>Upload</Title>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Select File</Text>
          <View style={styles.pickerRow}>
            <Button mode="outlined" onPress={handlePickDocument} style={styles.pickerButton}>
              📄 Document
            </Button>
            <Button mode="outlined" onPress={handlePickImage} style={styles.pickerButton}>
              🖼️ Image
            </Button>
          </View>
        </View>

        {selectedAsset && (
          <View style={[styles.fileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.fileIcon, { color: theme.text }]}>
              {documentHelpers.getDocumentIcon(
                selectedAsset.mimeType?.startsWith('image/') ? 'image' : documentHelpers.getDocumentType(selectedAsset.mimeType || '')
              )}
            </Text>
            <View style={styles.fileInfo}>
              <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={1}>
                {selectedAsset.name}
              </Text>
              <Text style={[styles.fileMeta, { color: theme.subText }]}>
                {selectedAsset.mimeType} • {formatSize(selectedAsset.size)}
              </Text>
            </View>
          </View>
        )}

        <HelperText type="info" visible={!!selectedAsset}>
          Max file size: {DOCUMENT_CONSTANTS.MAX_FILE_SIZE / 1024 / 1024}MB
        </HelperText>

        {isUploading && (
          <UploadProgress
            progress={{
              loaded: 0,
              total: 100,
              progress: 0,
              status: 'uploading',
            }}
            onCancel={resetProgress}
          />
        )}

        <Button
          mode="contained"
          onPress={handleUpload}
          disabled={!selectedAsset || isUploading}
          style={styles.uploadButton}
        >
          Upload
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  back: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  form: {
    padding: Spacing.md,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pickerButton: {
    flex: 1,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  fileIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
  },
  fileMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  uploadButton: {
    marginTop: Spacing.lg,
    backgroundColor: '#4f46e5',
  },
});
