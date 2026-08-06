import { Spacing } from '@/constants/theme';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UnitTimeline } from '../components/UnitTimeline';
import { unitsRepository } from '../repository/unitsRepository';

export default function UnitTimelineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: timeline, isLoading } = useQuery({
    queryKey: ['units', id, 'timeline'],
    queryFn: () => unitsRepository.fetchTimeline(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.loadingText}>Loading timeline...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <Text style={styles.headerTitle}>Timeline</Text>
        <Text style={styles.count}>{timeline?.length || 0} events</Text>
      </View>
      <View style={styles.content}>
        <UnitTimeline timeline={timeline || []} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  count: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
});
