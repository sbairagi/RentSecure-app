import { Spacing } from '@/constants/theme';
import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { DocumentCard } from '../components/DocumentCard';
import DocumentEmptyState from '../components/DocumentEmptyState';
import DocumentErrorState from '../components/DocumentErrorState';
import DocumentFilterSheet from '../components/DocumentFilterSheet';
import { DocumentSkeletonLoader } from '../components/DocumentSkeletonLoader';
import { useDocuments } from '../hooks/useDocuments';
import type { DocumentFilters } from '../types';

export default function DocumentsScreen() {
  const router = useRouter();
  const { documents, isLoading, isFetching, error, refresh } = useDocuments();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<DocumentFilters>({});

  const filtered = useMemo(() => {
    let list = [...documents];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.mime_type.toLowerCase().includes(q) ||
          String(d.id).includes(q)
      );
    }
    if (selectedFilters.type) {
      list = list.filter((d) => d.document_type === selectedFilters.type);
    }
    if (selectedFilters.is_favorite !== undefined) {
      list = list.filter((d) => d.is_favorite === selectedFilters.is_favorite);
    }
    if (selectedFilters.is_archived !== undefined) {
      list = list.filter((d) => d.is_archived === selectedFilters.is_archived);
    }
    return list;
  }, [documents, search, selectedFilters]);

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
          <FeatureLimitGuard featureKey="max_document_uploads">
            <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
              <DocumentSkeletonLoader type="list" />
            </View>
          </FeatureLimitGuard>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['document:read']}>
          <FeatureLimitGuard featureKey="max_document_uploads">
            <DocumentErrorState message={error} onRetry={refresh} />
          </FeatureLimitGuard>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['document:read']}>
        <FeatureLimitGuard featureKey="max_document_uploads">
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: '#111827' }]}>Documents</Text>
              <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Upload</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.toolbar}>
              <TouchableOpacity
                onPress={() => setShowFilters(true)}
                style={styles.toolButton}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Open filters"
              >
                <Text style={styles.toolButtonText}>Filters</Text>
              </TouchableOpacity>
            </View>
            <DocumentFilterSheet
              visible={showFilters}
              onClose={() => setShowFilters(false)}
              filters={selectedFilters}
              onApply={setSelectedFilters}
            />
            {filtered.length === 0 ? (
              <DocumentEmptyState onAction={handleAdd} />
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <DocumentCard
                    document={item}
                    onPress={() => handleDocumentPress(item.id)}
                  />
                )}
                refreshing={isFetching}
                onRefresh={refresh}
                contentContainerStyle={{ paddingBottom: Spacing.lg }}
              />
            )}
          </View>
        </FeatureLimitGuard>
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
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  toolButton: {
    backgroundColor: '#fff',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toolButtonText: {
    fontSize: 14,
    color: '#374151',
  },
});
