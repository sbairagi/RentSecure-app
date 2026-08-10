import { Spacing } from '@/constants/theme';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { DocumentCard } from './DocumentCard';
import type { UnitDocument } from '../types';

interface DocumentGridProps {
  documents: UnitDocument[];
  onPress: (id: number) => void;
  numColumns?: number;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onPress,
  numColumns = 2,
}) => {
  const renderItem = ({ item }: { item: UnitDocument }) => (
    <DocumentCard
      document={{
        id: item.id,
        name: item.document.split('/').pop() || `Document ${item.id}`,
        document_type: 'other',
        size: 0,
        mime_type: 'application/octet-stream',
        created_at: item.uploaded_at,
        file: item.document,
        file_hash: item.file_hash,
      } as any}
      onPress={() => onPress(item.id)}
    />
  );

  return (
    <FlatList
      data={documents}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      numColumns={numColumns}
      key={numColumns}
      contentContainerStyle={{ paddingBottom: Spacing.lg }}
    />
  );
};
