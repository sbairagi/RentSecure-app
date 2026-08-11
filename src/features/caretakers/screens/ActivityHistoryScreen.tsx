import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCaretaker } from '../hooks';
import { caretakersRepository } from '../repository';
import type { CaretakerHistoryEntry } from '../types';

export default function ActivityHistoryScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const _ = useCaretaker(Number(id));
  const [history, setHistory] = useState<CaretakerHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await caretakersRepository.fetchHistory(Number(id));
        if (mounted) setHistory(data);
      } catch {
        // ignore
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    if (id) load();
    return () => { mounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['caretaker:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>Loading...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Activity History</Text>
            {history.length === 0 ? (
              <Text style={[styles.subtitle, { color: theme.subText }]}>
                No activity records available.
              </Text>
            ) : (
              <View style={styles.timeline}>
                {history.map((item) => (
                  <View key={item.id} style={styles.timelineItem}>
                    <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                    <View style={styles.timelineContent}>
                      <Text style={[styles.action, { color: theme.text }]}>
                        {item.action === '+' ? 'Created' : item.action === '~' ? 'Updated' : item.action === '-' ? 'Deleted' : item.action}
                      </Text>
                      {item.changed_by && (
                        <Text style={[styles.meta, { color: theme.subText }]}>
                          By {item.changed_by}
                        </Text>
                      )}
                      <Text style={[styles.meta, { color: theme.subText }]}>
                        {new Date(item.timestamp).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  card: {
    padding: Spacing.md,
    borderRadius: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  timeline: {
    gap: 16,
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
    gap: 2,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  meta: {
    fontSize: 11,
  },
});
