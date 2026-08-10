import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentCard } from '../components/DocumentCard';
import { DocumentEmptyState } from '../components/DocumentEmptyState';
import { DocumentErrorState } from '../components/DocumentErrorState';
import { DocumentSkeletonLoader } from '../components/DocumentSkeletonLoader';

export default function DocumentSearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { documents, isLoading, error, refresh } = useDocuments({ unit: 1 });
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? documents.filter((d) =>
        d.document.toLowerCase().includes(query.toLowerCase())
      )
    : documents;

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
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
              placeholder="Search documents..."
              placeholderTextColor={theme.subText}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {query.trim() === '' ? (
            <DocumentEmptyState />
          ) : results.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={[styles.noResultsText, { color: theme.subText }]}>
                No documents matching &quot;{query}&quot;
              </Text>
            </View>
          ) : (
            results.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={{
                  id: doc.id,
                  name: doc.document.split('/').pop() || `Document ${doc.id}`,
                  document_type: 'other',
                  size: 0,
                  mime_type: 'application/octet-stream',
                  created_at: doc.uploaded_at,
                  file: doc.document,
                  file_hash: doc.file_hash,
                } as any}
                onPress={() => router.push(`/(drawer)/(tabs)/documents/${doc.id}`)}
              />
            ))
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
  searchContainer: {
    padding: Spacing.md,
  },
  searchInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
