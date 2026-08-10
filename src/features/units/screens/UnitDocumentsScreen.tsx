import { Spacing } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUnitDocuments } from '../hooks/useUnitDocuments';

export default function UnitDocumentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { documents, isLoading, error, refresh } = useUnitDocuments(Number(id));

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.loadingText}>Loading documents...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <Text style={styles.headerTitle}>Documents</Text>
        <Text style={styles.count}>{documents.length} documents</Text>
      </View>
      <View style={styles.content}>
        {documents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>No documents</Text>
            <Text style={styles.emptyDescription}>
              Documents will appear here once uploaded.
            </Text>
          </View>
        ) : (
          documents.map((doc) => (
            <View key={doc.id} style={[styles.docItem, { backgroundColor: '#fff' }]}>
              <Text style={styles.docName}>{doc.document.split('/').pop()}</Text>
              <Text style={styles.docDate}>{new Date(doc.uploaded_at).toLocaleDateString()}</Text>
            </View>
          ))
        )}
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
  errorText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#dc2626',
  },
  retryButton: {
    marginTop: Spacing.md,
    backgroundColor: '#4f46e5',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  docName: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  docDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
