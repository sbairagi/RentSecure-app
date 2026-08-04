import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { spacing } from '../tokens';

export interface PDFViewerProps {
  uri: string;
  style?: ViewStyle;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ uri, style }) => {
  const theme = useDesignSystemTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral[100] }, style]}>
      <View style={[styles.placeholder, { backgroundColor: theme.colors.neutral[50] }]}>
        <Text style={styles.placeholderText}>PDF Viewer</Text>
        <Text style={styles.uri}>{uri}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.md,
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  uri: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
