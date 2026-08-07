import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams } from 'expo-router';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import * as DocumentPicker from 'expo-document-picker';

export default function UploadDocumentsScreen() {
  const theme = useTheme();
  const _params = useLocalSearchParams<{ id: string }>();
  const [documents, setDocuments] = useState<string[]>([]);

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      multiple: true,
    });
    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset: any) => asset.uri);
      setDocuments((prev) => [...prev, ...uris]);
    }
  };

  const handleUpload = async () => {
    // API call would go here with FormData
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['maintenance:write']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.documentList}>
            {documents.map((uri, index) => (
              <View key={index} style={[styles.documentItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={styles.documentIcon}>📄</Text>
                <Text style={[styles.documentName, { color: theme.text }]} numberOfLines={1}>
                  {uri.split('/').pop()}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={[styles.addDocButton, { borderColor: theme.border }]} onPress={handlePickDocument}>
              <Text style={[styles.addDocText, { color: theme.textSecondary }]}>+ Add Document</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.uploadButton, { backgroundColor: theme.primary }]} onPress={handleUpload}>
            <Text style={styles.uploadText}>Upload Documents</Text>
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
  documentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  documentItem: {
    width: 150,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  documentIcon: {
    fontSize: 24,
  },
  documentName: {
    fontSize: 12,
  },
  addDocButton: {
    width: 150,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addDocText: {
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
