import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Title, Button, Dialog, Portal } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useDocumentMutations } from '../hooks/useDocumentMutations';
import { MetadataViewer } from '../components/MetadataViewer';
import { useDocumentsStore } from '../store/documentsStore';

export default function DocumentDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { remove } = useDocumentMutations();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const document = useDocumentsStore((state) =>
    state.documents.find((d) => d.id === Number(id)) || null
  );

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await remove.mutateAsync(Number(id));
      setShowDeleteDialog(false);
      router.back();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handlePreview = () => {
    if (!document) return;
    router.push(`/(drawer)/(tabs)/documents/${id}/preview`);
  };

  if (!document) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Document not found</Text>
      </View>
    );
  }

  const fileName = document.document.split('/').pop() || `Document ${document.id}`;

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['document:read']}>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>
            <Title style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {fileName}
            </Title>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.content}>
            <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: theme.subText }]}>File Name</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{fileName}</Text>

              <Text style={[styles.infoLabel, { color: theme.subText }]}>Uploaded</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {new Date(document.uploaded_at).toLocaleString()}
              </Text>
            </View>

            <MetadataViewer
              metadata={{
                file_hash: document.file_hash,
                id: document.id,
                unit: document.unit,
                renter: document.renter,
              }}
              title="Document Metadata"
            />

            <View style={styles.actions}>
              <Button mode="outlined" onPress={handlePreview} style={styles.actionButton}>
                Preview
              </Button>
              <Button mode="contained" onPress={handleDelete} style={styles.actionButton} buttonColor="#dc2626">
                Delete
              </Button>
            </View>
          </View>

          <Portal>
            <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
              <Dialog.Title>Delete Document</Dialog.Title>
              <Dialog.Content>
                <Text>Are you sure you want to delete this document? This action cannot be undone.</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button onPress={confirmDelete} textColor="#dc2626">Delete</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
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
    flex: 1,
    textAlign: 'center',
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
