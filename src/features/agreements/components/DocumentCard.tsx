import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { DocumentCardProps } from '../types';

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPreview,
  onDownload,
  onDelete,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.info}>
        <Text style={[styles.fileName, { color: theme.text }]}>{document.file_name}</Text>
        <Text style={[styles.meta, { color: theme.subText }]}>
          {(document.file_size / 1024).toFixed(1)} KB • {document.mime_type}
        </Text>
        <Text style={[styles.meta, { color: theme.subText }]}>
          Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        {onPreview && (
          <TouchableOpacity
            onPress={onPreview}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Preview document"
            style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
          >
            <Text style={styles.actionButtonText}>Preview</Text>
          </TouchableOpacity>
        )}
        {onDownload && (
          <TouchableOpacity
            onPress={onDownload}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Download document"
            style={[styles.actionButton, { backgroundColor: '#16a34a' }]}
          >
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Delete document"
            style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
