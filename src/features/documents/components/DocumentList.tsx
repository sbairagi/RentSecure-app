import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { DocumentCard } from './DocumentCard';
import type { Document } from '../types';

interface DocumentListProps {
  documents: Document[];
  onPress: (id: number) => void;
  onPreview?: (id: number) => void;
  onDownload?: (id: number) => void;
  onDelete?: (id: number) => void;
  onShare?: (id: number) => void;
  onFavorite?: (id: number) => void;
  onMove?: (id: number) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onPress,
  onPreview,
  onDownload,
  onDelete,
  onShare,
  onFavorite,
  onMove,
}) => {
  const theme = useTheme();

  const renderItem = ({ item }: { item: Document }) => (
    <DocumentCard
      document={item}
      onPress={() => onPress(item.id)}
      onPreview={onPreview ? () => onPreview(item.id) : undefined}
      onDownload={onDownload ? () => onDownload(item.id) : undefined}
      onDelete={onDelete ? () => onDelete(item.id) : undefined}
      onShare={onShare ? () => onShare(item.id) : undefined}
      onFavorite={onFavorite ? () => onFavorite(item.id) : undefined}
      onMove={onMove ? () => onMove(item.id) : undefined}
    />
  );

  return (
    <FlatList
      data={documents}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: Spacing.lg }}
    />
  );
};
