import { ErrorView } from '@/components/common/ErrorView';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';

interface BuildingErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const BuildingErrorState: React.FC<BuildingErrorStateProps> = ({
  message = 'Failed to load buildings. Please check your connection and try again.',
  onRetry,
}) => {
  const theme = useTheme();

  return (
    <ErrorView
      title="Something went wrong"
      message={message}
      onRetry={onRetry}
      retryLabel="Retry"
      style={{ backgroundColor: theme.background }}
    />
  );
};
