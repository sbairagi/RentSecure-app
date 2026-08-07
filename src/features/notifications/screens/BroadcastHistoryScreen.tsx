import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { NotificationEmptyState } from '../components/NotificationEmptyState';

export default function BroadcastHistoryScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Broadcast History
        </Text>
      </View>
      <NotificationEmptyState
        title="No broadcasts yet"
        message="System announcements and broadcasts will appear here"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
