import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { DeliveryTimeline } from '../components/DeliveryTimeline';
import { useDeliveryLogs } from '../hooks';

export default function CommunicationHistoryScreen() {
  const theme = useTheme();
  const { logs, isLoading, error } = useDeliveryLogs();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
          Loading communication history...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.error }}>
          Failed to load communication history
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <DeliveryTimeline logs={logs || []} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
