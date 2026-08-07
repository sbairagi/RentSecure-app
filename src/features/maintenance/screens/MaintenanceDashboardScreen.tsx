import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MAINTENANCE_CONSTANTS } from '../constants';
import type { MaintenanceStats } from '../types';

interface MaintenanceDashboardScreenProps {
  stats: MaintenanceStats | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onNavigateToList: (filter?: string) => void;
}

export const MaintenanceDashboardScreen: React.FC<MaintenanceDashboardScreenProps> = ({
  stats,
  isLoading,
  error,
  onRefresh: _onRefresh,
  onNavigateToList,
}) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Error loading dashboard</Text>
        <Text style={[styles.errorDetail, { color: theme.textSecondary }]}>{error}</Text>
      </View>
    );
  }

  const statCards = [
    { label: MAINTENANCE_CONSTANTS.DASHBOARD.OPEN_REQUESTS, value: stats?.open || 0, color: '#f97316', onPress: () => onNavigateToList('open') },
    { label: MAINTENANCE_CONSTANTS.DASHBOARD.IN_PROGRESS, value: stats?.in_progress || 0, color: '#3b82f6', onPress: () => onNavigateToList('in_progress') },
    { label: MAINTENANCE_CONSTANTS.DASHBOARD.RESOLVED, value: stats?.resolved || 0, color: '#10b981', onPress: () => onNavigateToList('resolved') },
    { label: MAINTENANCE_CONSTANTS.DASHBOARD.CLOSED, value: stats?.closed || 0, color: '#059669', onPress: () => onNavigateToList('closed') },
    { label: MAINTENANCE_CONSTANTS.DASHBOARD.URGENT, value: stats?.urgent || 0, color: '#ef4444', onPress: () => onNavigateToList('urgent') },
    { label: MAINTENANCE_CONSTANTS.DASHBOARD.PENDING_APPROVAL, value: stats?.pending_approval || 0, color: '#eab308', onPress: () => onNavigateToList('pending_approval') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.statsGrid}>
        {statCards.map((card) => (
          <TouchableOpacity
            key={card.label}
            style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={card.onPress}
          >
            <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{card.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {stats?.total_expenses && (
        <View style={[styles.expenseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.expenseLabel, { color: theme.textSecondary }]}>
            {MAINTENANCE_CONSTANTS.DASHBOARD.TOTAL_EXPENSES}
          </Text>
          <Text style={[styles.expenseValue, { color: theme.text }]}>₹{stats.total_expenses}</Text>
        </View>
      )}
    </View>
  );
};

export default MaintenanceDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 18,
    fontWeight: '600',
  },
  errorDetail: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    paddingHorizontal: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  expenseCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseLabel: {
    fontSize: 14,
  },
  expenseValue: {
    fontSize: 18,
    fontWeight: '600',
  },
});
