import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { DocumentCard } from '../components/DocumentCard';
import { DocumentEmptyState } from '../components/DocumentEmptyState';
import { DocumentErrorState } from '../components/DocumentErrorState';
import { DocumentSkeletonLoader } from '../components/DocumentSkeletonLoader';
import { useDocuments } from '../hooks/useDocuments';

export default function DocumentsScreen() {
  const router = useRouter();
  const { documents, isLoading, error, refresh } = useDocuments({ unit: 1 });

  const handleAdd = () => {
    router.push('/(drawer)/(tabs)/documents/upload');
  };

  const handleDocumentPress = (documentId: number) => {
    router.push(`/(drawer)/(tabs)/documents/${documentId}`);
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['document:read']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <DocumentSkeletonLoader />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['document:read']}>
          <DocumentErrorState message={error} onRetry={refresh} />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['document:read']}>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: '#111827' }]}>Documents</Text>
            <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Upload</Text>
            </TouchableOpacity>
          </View>
          {documents.length === 0 ? (
            <DocumentEmptyState onAction={handleAdd} />
          ) : (
            <FlatList
              data={documents}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <DocumentCard
                  document={{
                    id: item.id,
                    name: item.document.split('/').pop() || `Document ${item.id}`,
                    document_type: 'other',
                    size: 0,
                    mime_type: 'application/octet-stream',
                    created_at: item.uploaded_at,
                    file: item.document,
                    file_hash: item.file_hash,
                  } as any}
                  onPress={() => handleDocumentPress(item.id)}
                />
              )}
              refreshing={isFetching}
              onRefresh={refresh}
              contentContainerStyle={{ paddingBottom: Spacing.lg }}
            />
          )}
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
