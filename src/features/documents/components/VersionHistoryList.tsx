import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DocumentVersion } from '../types';

interface VersionHistoryListProps {
  versions: DocumentVersion[];
  onPressVersion?: (version: DocumentVersion) => void;
}

export const VersionHistoryList: React.FC<VersionHistoryListProps> = ({
  versions,
  onPressVersion,
}) => {
  const theme = useTheme();

  if (!versions || versions.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: theme.subText }]}>
          No version history available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Version History</Text>
      <View style={[styles.list, { borderColor: theme.border }]}>
        {versions.map((version, index) => (
          <TouchableOpacity
            key={version.id}
            style={[
              styles.versionItem,
              { borderBottomColor: theme.border, backgroundColor: index % 2 === 0 ? theme.card : theme.background },
            ]}
            onPress={() => onPressVersion?.(version)}
            disabled={!onPressVersion}
          >
            <View style={styles.versionHeader}>
              <Text style={[styles.versionNumber, { color: theme.text }]}>
                v{version.version}
              </Text>
              <Text style={[styles.versionDate, { color: theme.subText }]}>
                {new Date(version.created_at).toLocaleString()}
              </Text>
            </View>
            <Text style={[styles.versionMeta, { color: theme.subText }]}>
              {version.created_by} • {(version.size / 1024).toFixed(1)} KB
            </Text>
            {version.change_summary && (
              <Text style={[styles.changeSummary, { color: theme.subText }]}>
                {version.change_summary}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  list: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  versionItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  versionDate: {
    fontSize: 12,
  },
  versionMeta: {
    fontSize: 12,
    marginBottom: 4,
  },
  changeSummary: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  empty: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
