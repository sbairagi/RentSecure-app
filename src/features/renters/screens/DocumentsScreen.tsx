import { Spacing } from '@/constants/theme';
import { useRenterDocuments } from '@/features/renters/hooks/useRenterDocuments';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

export default function DocumentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { documents, isLoading } = useRenterDocuments(Number(id));

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Documents</Title>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : documents && documents.length > 0 ? (
          documents.map((doc) => (
            <View key={doc.id} style={styles.docItem}>
              <Text style={styles.docName}>{doc.document}</Text>
              <Text style={styles.docDate}>{new Date(doc.uploaded_at).toLocaleDateString()}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No documents uploaded yet.</Text>
        )}
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    color: '#6b7280',
  },
  docItem: {
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  docName: {
    fontSize: 14,
    fontWeight: '500',
  },
  docDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});
