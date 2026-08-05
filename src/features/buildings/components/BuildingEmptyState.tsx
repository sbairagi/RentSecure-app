import { EmptyState } from '@/components/common/EmptyState';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';

interface BuildingEmptyStateProps {
  onAction?: () => void;
}

export const BuildingEmptyState: React.FC<BuildingEmptyStateProps> = ({ onAction }) => {
  const theme = useTheme();

  return (
    <EmptyState
      title="No Buildings Found"
      description="You haven't added any buildings yet. Start by adding your first building."
      actionLabel={onAction ? 'Add Building' : undefined}
      onAction={onAction}
      style={{ backgroundColor: theme.background }}
    />
  );
};
