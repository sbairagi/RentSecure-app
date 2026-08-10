import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface MetadataField {
  key: string;
  label: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array';
}

interface MetadataViewerProps {
  metadata: Record<string, any>;
  title?: string;
}

export const MetadataViewer: React.FC<MetadataViewerProps> = ({ metadata, title = 'Metadata' }) => {
  const theme = useTheme();

  if (!metadata || Object.keys(metadata).length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: theme.subText }]}>No metadata available</Text>
      </View>
    );
  }

  const fields: MetadataField[] = Object.entries(metadata).map(([key, value]) => {
    let type: MetadataField['type'] = 'string';
    if (typeof value === 'number') type = 'number';
    else if (typeof value === 'boolean') type = 'boolean';
    else if (value instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(String(value))) type = 'date';
    else if (Array.isArray(value)) type = 'array';

    return { key, label: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()), value, type };
  });

  const formatValue = (field: MetadataField) => {
    if (field.type === 'date') return new Date(field.value).toLocaleString();
    if (field.type === 'boolean') return field.value ? 'Yes' : 'No';
    if (field.type === 'array') return JSON.stringify(field.value);
    return String(field.value);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <View style={[styles.table, { borderColor: theme.border }]}>
        {fields.map((field, index) => (
          <View
            key={field.key}
            style={[
              styles.row,
              { borderBottomColor: theme.border, backgroundColor: index % 2 === 0 ? theme.card : theme.background },
            ]}
          >
            <Text style={[styles.key, { color: theme.subText }]}>{field.label}</Text>
            <Text style={[styles.value, { color: theme.text }]} numberOfLines={3}>
              {formatValue(field)}
            </Text>
          </View>
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
  table: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  key: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  value: {
    flex: 2,
    fontSize: 13,
  },
  empty: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
