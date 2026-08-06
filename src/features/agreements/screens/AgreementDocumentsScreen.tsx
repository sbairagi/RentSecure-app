import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DocumentCard } from '../components/DocumentCard';
import { useAgreementDocuments } from '../hooks/useAgreementDocuments';

export default function AgreementDocumentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { documents, isLoading, error } = useAgreementDocuments(Number(id));
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={styles.loadingText}>Loading documents...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Documents</Text>
      {documents.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.subText }]}>No documents uploaded yet.</Text>
        </View>
      ) : (
        documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onPreview={() => {}}
            onDownload={() => {}}
            onDelete={() => {}}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: 14,
  },
});
