import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function NotificationDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Notification Details
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: theme.colors.onSurfaceVariant }]}>
          Notification ID: {id}
        </Text>
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
});
