import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import type { DocumentUploadProgress } from '../types';

interface UploadProgressProps {
  progress: DocumentUploadProgress;
  onCancel?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress, onCancel }) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (progress.status) {
      case 'complete':
        return '#16a34a';
      case 'error':
        return '#dc2626';
      default:
        return '#4f46e5';
    }
  };

  const getStatusLabel = () => {
    switch (progress.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'complete':
        return 'Complete';
      case 'error':
        return progress.error || 'Error';
      default:
        return 'Uploading...';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {getStatusLabel()}
        </Text>
        {onCancel && progress.status === 'uploading' && (
          <Text
            onPress={onCancel}
            style={styles.cancel}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Cancel upload"
          >
            Cancel
          </Text>
        )}
      </View>
      <ProgressBar
        progress={progress.progress / 100}
        color={getStatusColor()}
        style={styles.progressBar}
      />
      <Text style={[styles.percent, { color: theme.subText }]}>
        {Math.round(progress.progress)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancel: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  percent: {
    fontSize: 12,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});
