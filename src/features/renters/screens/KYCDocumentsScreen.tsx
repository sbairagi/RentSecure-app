import { Spacing } from '@/constants/theme';
import { KYCDocumentCard } from '@/features/renters/components/KYCDocumentCard';
import { KYCUploadDialog } from '@/features/renters/components/KYCUploadDialog';
import { useRenterKYC } from '@/features/renters/hooks/useRenterKYC';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FAB, Title } from 'react-native-paper';

export default function KYCDocumentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [uploadVisible, setUploadVisible] = useState(false);
  const { kycDocuments, isLoading, refresh } = useRenterKYC(Number(id));

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>KYC Documents</Title>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : kycDocuments && kycDocuments.length > 0 ? (
          kycDocuments.map((doc) => (
            <KYCDocumentCard
              key={doc.id}
              document={doc}
              onPreview={() => {}}
              onDownload={() => {}}
              onDelete={() => {}}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No KYC documents uploaded yet.</Text>
        )}
        <FAB style={styles.fab} icon="plus" onPress={() => setUploadVisible(true)} />
        <KYCUploadDialog
          visible={uploadVisible}
          onClose={() => setUploadVisible(false)}
          onSubmit={() => {
            setUploadVisible(false);
            refresh();
          }}
        />
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
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
  },
});
