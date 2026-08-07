import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import type { NotificationType, NotificationChannel } from '../types';
import { NOTIFICATION_TYPE_CONFIG } from '../constants/notificationTypes';

interface NotificationFilterSheetProps {
  visible: boolean;
  filters: {
    search?: string;
    type?: NotificationType | 'all';
    channel?: NotificationChannel | 'all';
    read_status?: 'all' | 'read' | 'unread';
  };
  onClose: () => void;
  onApply: (filters: {
    search?: string;
    type?: NotificationType | 'all';
    channel?: NotificationChannel | 'all';
    read_status?: 'all' | 'read' | 'unread';
  }) => void;
}

export const NotificationFilterSheet: React.FC<NotificationFilterSheetProps> = ({
  visible,
  filters,
  onClose,
  onApply,
}) => {
  const theme = useTheme();
  const [search, setSearch] = React.useState(filters.search || '');
  const [selectedType, setSelectedType] = React.useState<NotificationType | 'all'>(
    filters.type || 'all'
  );
  const [selectedChannel, setSelectedChannel] = React.useState<NotificationChannel | 'all'>(
    filters.channel || 'all'
  );
  const [readStatus, setReadStatus] = React.useState<'all' | 'read' | 'unread'>(
    filters.read_status || 'all'
  );

  const handleApply = () => {
    onApply({
      search,
      type: selectedType,
      channel: selectedChannel,
      read_status: readStatus,
    });
    onClose();
  };

  const handleReset = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedChannel('all');
    setReadStatus('all');
    onApply({});
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Filters</Text>
        <View style={styles.headerActions}>
          <Text onPress={handleReset} style={[styles.resetText, { color: theme.colors.primary }]}>
            Reset
          </Text>
          <Text onPress={onClose} style={[styles.closeText, { color: theme.colors.primary }]}>
            Close
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Search</Text>
        <TextInput
          mode="outlined"
          placeholder="Search notifications..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          dense
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Type</Text>
        <View style={styles.chipContainer}>
          <Button
            mode={selectedType === 'all' ? 'contained' : 'outlined'}
            onPress={() => setSelectedType('all')}
            compact
          >
            All
          </Button>
          {Object.entries(NOTIFICATION_TYPE_CONFIG).map(([key, config]) => (
            <Button
              key={key}
              mode={selectedType === key ? 'contained' : 'outlined'}
              onPress={() => setSelectedType(key as NotificationType)}
              compact
              icon={config.icon}
            >
              {config.label}
            </Button>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Read Status</Text>
        <View style={styles.chipContainer}>
          {(['all', 'read', 'unread'] as const).map((status) => (
            <Button
              key={status}
              mode={readStatus === status ? 'contained' : 'outlined'}
              onPress={() => setReadStatus(status)}
              compact
            >
              {status === 'all' ? 'All' : status === 'read' ? 'Read' : 'Unread'}
            </Button>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button mode="contained" onPress={handleApply} style={styles.button}>
          Apply Filters
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  button: {
    minWidth: 120,
  },
});
