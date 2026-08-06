import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import type { KYCDocumentCardProps } from '../types';

const VERIFICATION_COLORS: Record<string, string> = {
  verified: '#16a34a',
  pending: '#d97706',
  rejected: '#dc2626',
};

export const KYCDocumentCard: React.FC<KYCDocumentCardProps> = ({
  document,
  onPreview,
  onDownload,
  onDelete,
}) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.card }]}>
      <Card.Content>
        <View style={styles.header}>
          <View>
            <Text style={[styles.type, { color: theme.text }]}>
              {document.document_type.replace(/_/g, ' ').toUpperCase()}
            </Text>
            <Text style={[styles.number, { color: theme.subText }]}>
              {document.document_number}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  (VERIFICATION_COLORS[document.is_verified ? 'verified' : 'pending'] ||
                    '#6b7280') + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    VERIFICATION_COLORS[document.is_verified ? 'verified' : 'pending'] || '#6b7280',
                },
              ]}
            >
              {document.is_verified ? 'Verified' : 'Pending'}
            </Text>
          </View>
        </View>
        {document.expiry_date && (
          <Text style={[styles.expiry, { color: theme.subText }]}>
            Expires: {new Date(document.expiry_date).toLocaleDateString()}
          </Text>
        )}
        <Text style={[styles.uploaded, { color: theme.subText }]}>
          Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
        </Text>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <IconButton
          icon="eye"
          size={18}
          onPress={onPreview}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Preview document"
        />
        <IconButton
          icon="download"
          size={18}
          onPress={onDownload}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Download document"
        />
        <IconButton
          icon="delete"
          size={18}
          onPress={onDelete}
          iconColor={theme.danger}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Delete document"
        />
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  type: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  number: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  expiry: {
    fontSize: 13,
    marginTop: Spacing.sm,
  },
  uploaded: {
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    justifyContent: 'flex-end',
  },
});
