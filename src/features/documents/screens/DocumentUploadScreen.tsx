import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Title, Button, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { UploadProgress } from '../components/UploadProgress';
import { DOCUMENT_CONSTANTS } from '../constants/documents';

export default function DocumentUploadScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; size: number; mimeType: string } | null>(null);
  const { upload, isUploading, resetProgress } = useUploadDocument();

  const handlePickFile = async () => {
    // In a real app, use expo-document-picker or expo-image-picker
    // For demo, we simulate selection
    const mockFile = {
      uri: 'file:///tmp/test.pdf',
      name: 'document.pdf',
      size: 1024 * 1024,
      mimeType: 'application/pdf',
    };
    setSelectedFile(mockFile);
    setName(mockFile.name);
  };

  const handleUpload = async () => {
    if (!selectedFile || !name.trim()) return;

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('file', {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.mimeType,
    } as any);
    formData.append('document_type', 'pdf');

    await upload({ name: name.trim(), file: formData });
  };

  const formatSize = (bytes: number) => {
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
        <Title style={[styles.title, { color: theme.text }]}>Upload Document</Title>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>Document Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter document name"
            placeholderTextColor={theme.subText}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>File</Text>
          <TouchableOpacity
            style={[styles.filePicker, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handlePickFile}
          >
            <Text style={styles.filePickerText}>
              {selectedFile ? selectedFile.name : 'Tap to select file'}
            </Text>
            {selectedFile && (
              <Text style={[styles.fileSize, { color: theme.subText }]}>
                {formatSize(selectedFile.size)}
              </Text>
            )}
          </TouchableOpacity>
          <HelperText type="info" visible={!!selectedFile}>
            Max file size: {DOCUMENT_CONSTANTS.MAX_FILE_SIZE / 1024 / 1024}MB
          </HelperText>
        </View>

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
          disabled={!selectedFile || !name.trim() || isUploading}
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
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
  },
  filePicker: {
    borderRadius: 8,
    borderWidth: 1,
    padding: Spacing.md,
    minHeight: 60,
    justifyContent: 'center',
  },
  filePickerText: {
    fontSize: 16,
  },
  fileSize: {
    fontSize: 12,
    marginTop: 4,
  },
  uploadButton: {
    marginTop: Spacing.lg,
    backgroundColor: '#4f46e5',
  },
});
