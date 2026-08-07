import { StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDeliveryStats, useDeliveryLogs } from '../hooks';
import { DeliveryTimeline } from '../components/DeliveryTimeline';

export default function DeliveryStatusScreen() {
  const theme = useTheme();
  const router = useRouter();
  const statsQuery = useDeliveryStats();
  const { logs, isLoading } = useDeliveryLogs();

  const renderStatCard = (label: string, value: number | string, color: string) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Delivery Status</Text>
      </View>

      {statsQuery.data && (
        <View style={styles.statsContainer}>
          {renderStatCard('Total Sent', statsQuery.data.total_sent, theme.colors.primary)}
          {renderStatCard('Delivered', statsQuery.data.total_delivered, '#059669')}
          {renderStatCard('Failed', statsQuery.data.total_failed, '#DC2626')}
          {renderStatCard('Rate', `${statsQuery.data.delivery_rate}%`, theme.colors.primary)}
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Recent Deliveries
        </Text>
        {isLoading ? (
          <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
            Loading delivery logs...
          </Text>
        ) : logs && logs.length > 0 ? (
          <DeliveryTimeline logs={logs.slice(0, 10)} />
        ) : (
          <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
            No delivery logs available
          </Text>
        )}
      </View>
    </View>
  );
};

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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
});
