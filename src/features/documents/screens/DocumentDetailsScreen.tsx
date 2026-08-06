import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDocumentMutations } from '../hooks/useDocumentMutations';
import { MetadataViewer } from '../components/MetadataViewer';
import { VersionHistoryList } from '../components/VersionHistoryList';

export default function DocumentDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { archive, restore, remove } = useDocumentMutations();

  // In a real app, fetch document by id using useQuery
  const document = {
    id: Number(id),
    name: 'Sample Document',
    document_type: 'pdf',
    size: 1024 * 1024,
    mime_type: 'application/pdf',
    created_at: new Date().toISOString(),
    is_favorite: false,
    is_archived: false,
    metadata: { uploaded_by: 'user', source: 'mobile' },
  };

  const handleArchive = () => {
    if (document.is_archived) {
      restore.mutate(document.id);
    } else {
      archive.mutate(document.id);
    }
  };

  const handleDelete = () => {
    remove.mutate(document.id);
    router.back();
  };

  const handlePreview = () => {
    router.push(`/(drawer)/(tabs)/documents/${id}/preview`);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Title style={[styles.title, { color: theme.text }]}>{document.name}</Title>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoLabel, { color: theme.subText }]}>Type</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {document.document_type.toUpperCase()}
          </Text>

          <Text style={[styles.infoLabel, { color: theme.subText }]}>Size</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {(document.size / 1024 / 1024).toFixed(2)} MB
          </Text>

          <Text style={[styles.infoLabel, { color: theme.subText }]}>Created</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {new Date(document.created_at).toLocaleString()}
          </Text>
        </View>

        <MetadataViewer metadata={document.metadata} title="Document Metadata" />

        <View style={styles.actions}>
          <Button mode="outlined" onPress={handlePreview} style={styles.actionButton}>
            Preview
          </Button>
          <Button mode="outlined" onPress={handleArchive} style={styles.actionButton}>
            {document.is_archived ? 'Restore' : 'Archive'}
          </Button>
          <Button mode="contained" onPress={handleDelete} style={styles.actionButton} buttonColor="#dc2626">
            Delete
          </Button>
        </View>
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
  content: {
    padding: Spacing.md,
  },
  infoCard: {
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
