import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import type { DocumentCardProps } from '../types';

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
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onPreview,
  onDownload,
  onDelete,
  onShare,
  onFavorite,
  onMove,
}) => {
  const theme = useTheme();

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const icon = DOCUMENT_TYPE_ICONS[document.document_type] || '📄';
  const color = DOCUMENT_TYPE_COLORS[document.document_type] || '#6b7280';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${document.name}, ${document.document_type}, ${formatSize(document.size)}`}
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {document.thumbnail && document.document_type === 'image' ? (
            <Image
              source={{ uri: document.thumbnail }}
              style={styles.thumbnail}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.iconBadge, { backgroundColor: color + '20' }]}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {document.name}
          </Text>
          <Text style={[styles.meta, { color: theme.subText }]}>
            {document.document_type.toUpperCase()} • {formatSize(document.size)}
          </Text>
          <Text style={[styles.date, { color: theme.subText }]}>
            {new Date(document.created_at).toLocaleDateString()}
          </Text>
        </View>
        {document.is_favorite && (
          <Text style={styles.favoriteIcon}>⭐</Text>
        )}
      </View>
      {(onPreview || onDownload || onDelete || onShare || onFavorite || onMove) && (
        <View style={[styles.actions, { borderTopColor: theme.border }]}>
          {onPreview && (
            <TouchableOpacity
              onPress={onPreview}
              style={[styles.actionButton, { backgroundColor: '#2563eb' }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Preview document"
            >
              <Text style={styles.actionButtonText}>Preview</Text>
            </TouchableOpacity>
          )}
          {onDownload && (
            <TouchableOpacity
              onPress={onDownload}
              style={[styles.actionButton, { backgroundColor: '#16a34a' }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Download document"
            >
              <Text style={styles.actionButtonText}>Download</Text>
            </TouchableOpacity>
          )}
          {onShare && (
            <TouchableOpacity
              onPress={onShare}
              style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Share document"
            >
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          )}
          {onFavorite && (
            <TouchableOpacity
              onPress={onFavorite}
              style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Toggle favorite"
            >
              <Text style={styles.actionButtonText}>
                {document.is_favorite ? 'Unfavorite' : 'Favorite'}
              </Text>
            </TouchableOpacity>
          )}
          {onMove && (
            <TouchableOpacity
              onPress={onMove}
              style={[styles.actionButton, { backgroundColor: '#6b7280' }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Move document"
            >
              <Text style={styles.actionButtonText}>Move</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              style={[styles.actionButton, { backgroundColor: '#dc2626' }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Delete document"
            >
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
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
  date: {
    fontSize: 11,
    marginTop: 2,
  },
  favoriteIcon: {
    fontSize: 18,
    marginLeft: Spacing.sm,
  },
  actions: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
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

export default memo(DocumentCard);
