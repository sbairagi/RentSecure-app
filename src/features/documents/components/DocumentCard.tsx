import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import type { UnitDocument } from '../types';

interface DocumentCardProps {
  document: UnitDocument & { name?: string; document_type?: string; size?: number; mime_type?: string; created_at?: string };
  onPress: () => void;
}

const DOCUMENT_TYPE_ICONS: Record<string, string> = {
  image: '🖼️',
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  excel: '📊',
  csv: '📈',
  zip: '📦',
  text: '📃',
  audio: '🎵',
  video: '🎬',
  other: '📎',
};

const DOCUMENT_TYPE_COLORS: Record<string, string> = {
  image: '#10b981',
  pdf: '#dc2626',
  doc: '#2563eb',
  docx: '#2563eb',
  excel: '#16a34a',
  csv: '#16a34a',
  zip: '#f59e0b',
  text: '#6b7280',
  audio: '#8b5cf6',
  video: '#ec4899',
  other: '#6b7280',
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onPress }) => {
  const theme = useTheme();

  const fileName = document.name || document.document.split('/').pop() || `Document ${document.id}`;
  const docType = document.document_type || 'other';
  const icon = DOCUMENT_TYPE_ICONS[docType] || '📄';
  const color = DOCUMENT_TYPE_COLORS[docType] || '#6b7280';
  const uploadedAt = document.created_at || document.uploaded_at;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${fileName}, ${docType}`}
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconBadge, { backgroundColor: color + '20' }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {fileName}
          </Text>
          <Text style={[styles.meta, { color: theme.subText }]}>
            {docType.toUpperCase()} • {uploadedAt ? new Date(uploadedAt).toLocaleDateString() : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default memo(DocumentCard);
