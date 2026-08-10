import { AnimatedBarChart } from '@/components/charts/AnimatedBarChart';
import { AnimatedLineChart } from '@/components/charts/AnimatedLineChart';
import { SkeletonChart, SkeletonStatCard } from '@/components/loaders/SkeletonCard';
import { useAuthStore } from '@/store/authStore';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Avatar, Button, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  DashboardNotifications,
  DashboardPendingTasks,
  DashboardQuickActions,
  DashboardRecentActivity,
  DashboardStatsCard,
  DashboardSubscriptionWidget,
} from '../components';
import { useDashboard } from '../hooks';
import type { FeatureUsage, SubscriptionPlan } from '../types/dashboard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_COLUMNS = SCREEN_WIDTH > 768 ? 4 : 2;

export default function OwnerDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const netInfo = useNetInfo();
  const user = useAuthStore((s) => s.user);

  const { data: dashboardData, isLoading, error, pullToRefresh } = useDashboard();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await pullToRefresh();
    } catch {
      showMessage({ message: 'Failed to refresh dashboard', type: 'danger' });
    } finally {
      setRefreshing(false);
    }
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const userName = user?.fullName || user?.firstName || 'User';

  const stats = useMemo(() => {
    if (!dashboardData?.stats) return null;
    const s = dashboardData.stats;
    return [
      { title: 'Total Buildings', value: s.total_buildings, icon: '🏢', color: '#2563EB', route: '/(drawer)/(tabs)/buildings' },
      { title: 'Total Units', value: s.total_units, icon: '🚪', color: '#059669', route: '/(drawer)/(tabs)/units' },
      { title: 'Occupied', value: s.occupied_units, icon: '👥', color: '#D97706', route: '/(drawer)/(tabs)/units' },
      { title: 'Vacant', value: s.vacant_units, icon: '🔓', color: '#DC2626', route: '/(drawer)/(tabs)/units' },
      { title: 'Active Renters', value: s.active_renters, icon: '👤', color: '#7C3AED', route: '/(drawer)/(tabs)/renters' },
      { title: 'Notice Period', value: s.notice_period_renters, icon: '📋', color: '#D97706', route: '/(drawer)/(tabs)/renters' },
      { title: 'Revoked', value: s.revoked_renters, icon: '🚫', color: '#DC2626', route: '/(drawer)/(tabs)/renters' },
      { title: 'Deactivated', value: s.deactivated_renters, icon: '⏸️', color: '#6B7280', route: '/(drawer)/(tabs)/renters' },
      { title: 'Rent Expected', value: `₹${s.rent_expected}`, icon: '📊', color: '#2563EB' },
      { title: 'Rent Collected', value: `₹${s.rent_collected}`, icon: '✅', color: '#059669' },
      { title: 'Rent Pending', value: `₹${s.rent_pending}`, icon: '⏳', color: '#D97706' },
      { title: 'Rent Overdue', value: `₹${s.rent_overdue}`, icon: '⚠️', color: '#DC2626', route: '/(drawer)/(tabs)/payments' },
      { title: 'Late Fees', value: `₹${s.late_fees_total}`, icon: '💲', color: '#7C3AED' },
      { title: 'Collection Rate', value: `${s.collection_rate}%`, icon: '📈', color: '#0891B2' },
    ];
  }, [dashboardData]);

  const rentCollectionData = useMemo(() => {
    if (!dashboardData?.analytics?.monthly_rent_collection) return [];
    return dashboardData.analytics.monthly_rent_collection.map((item) => ({
      label: item.month,
      value: item.amount,
    }));
  }, [dashboardData]);

  const occupancyData = useMemo(() => {
    if (!dashboardData?.analytics?.occupancy_trend) return [];
    return dashboardData.analytics.occupancy_trend.map((item) => ({
      label: item.month,
      value: item.rate,
      color: '#7C3AED',
    }));
  }, [dashboardData]);

  const subscription: SubscriptionPlan | null = dashboardData?.subscription || null;
  const featureUsage: FeatureUsage[] = dashboardData?.feature_usage || [];
  const currentMonth = dashboardData?.stats?.current_month || '';

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.headerLeft}>
        <Avatar.Text
          size={48}
          label={userName.charAt(0).toUpperCase()}
          style={{ backgroundColor: theme.colors.primaryContainer }}
          labelStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 20 }}
        />
        <View style={styles.headerText}>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onSurface, fontWeight: '600' }}
          >
            {greeting}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {userName}
          </Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        {currentMonth ? (
          <View
            style={[
              styles.monthBadge,
              { backgroundColor: `${theme.colors.primary}15` },
            ]}
          >
            <Text
              style={[
                styles.monthBadgeText,
                { color: theme.colors.primary },
              ]}
            >
              {currentMonth}
            </Text>
          </View>
        ) : null}
        {subscription && (
          <View
            style={[
              styles.subscriptionBadge,
              {
                backgroundColor: subscription.is_active_subscription
                  ? `${theme.colors.primary}15`
                  : `${theme.colors.error}15`,
              },
            ]}
          >
            <Text
              style={[
                styles.subscriptionBadgeText,
                {
                  color: subscription.is_active_subscription
                    ? theme.colors.primary
                    : theme.colors.error,
                },
              ]}
            >
              {subscription.name}
            </Text>
          </View>
        )}
        <IconButton
          icon="bell-outline"
          size={24}
          onPress={() => router.push('/(drawer)/(tabs)/notifications')}
          style={styles.headerIcon}
          iconColor={theme.colors.onSurfaceVariant}
        />
        <IconButton
          icon="cog-outline"
          size={24}
          onPress={() => router.push('/(drawer)/(tabs)/settings')}
          style={styles.headerIcon}
          iconColor={theme.colors.onSurfaceVariant}
        />
      </View>
    </View>
  );

  const renderStatsGrid = () => {
    if (isLoading) {
      return (
        <View style={styles.statsGrid}>
          {Array.from({ length: GRID_COLUMNS * 2 }).map((_, i) => (
            <View key={i} style={{ flex: 1 / GRID_COLUMNS, marginHorizontal: 4, marginBottom: 12 }}>
              <SkeletonStatCard />
            </View>
          ))}
        </View>
      );
    }

    if (!stats || stats.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>No stats available</Text>
        </View>
      );
    }

    return (
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <Animated.View
            key={stat.title}
            entering={FadeInDown.duration(400)}
            style={{ flex: 1 / GRID_COLUMNS, marginHorizontal: 4, marginBottom: 12 }}
          >
            <DashboardStatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              onPress={stat.route ? () => router.push(stat.route) : undefined}
            />
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderAnalytics = () => {
    if (isLoading) {
      return (
        <View style={styles.analyticsContainer}>
          <SkeletonChart />
        </View>
      );
    }

    return (
      <View style={styles.analyticsContainer}>
        <View
          style={[
            styles.chartCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
          ]}
        >
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
              marginBottom: 12,
              paddingHorizontal: 16,
              paddingTop: 16,
            }}
          >
            Rent Collection Trend
          </Text>
          {rentCollectionData.length > 0 ? (
            <AnimatedLineChart
              data={rentCollectionData}
              color={theme.colors.primary}
              height={200}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>No rent collection data</Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
              marginTop: 16,
            },
          ]}
        >
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
              marginBottom: 12,
              paddingHorizontal: 16,
              paddingTop: 16,
            }}
          >
            Occupancy Trend
          </Text>
          {occupancyData.length > 0 ? (
            <AnimatedBarChart data={occupancyData} height={200} />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>No occupancy data</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderPaymentStatusSummary = () => {
    if (!dashboardData?.stats?.payment_status_breakdown) return null;
    const ps = dashboardData.stats.payment_status_breakdown;
    const items = [
      { label: 'Paid', count: ps.paid, color: '#059669' },
      { label: 'Pending', count: ps.pending, color: '#D97706' },
      { label: 'Overdue', count: ps.overdue, color: '#DC2626' },
      { label: 'Cancelled', count: ps.cancelled, color: '#6B7280' },
    ];
    return (
      <View style={styles.section}>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 12 }}
        >
          Payment Status
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paymentScrollContent}
        >
          {items.map((item) => (
            <View
              key={item.label}
              style={[
                styles.paymentCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
              ]}
            >
              <Text style={[styles.paymentCount, { color: item.color }]}>
                {item.count}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderPayoutSummary = () => {
    if (!dashboardData?.payouts) return null;
    const p = dashboardData.payouts;
    const items = [
      { label: 'Successful', count: p.success, color: '#059669' },
      { label: 'Pending', count: p.pending, color: '#D97706' },
      { label: 'Failed', count: p.failed, color: '#DC2626' },
    ];
    return (
      <View style={styles.section}>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 12 }}
        >
          Payout Summary
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.paymentScrollContent}
        >
          {items.map((item) => (
            <View
              key={item.label}
              style={[
                styles.paymentCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
              ]}
            >
              <Text style={[styles.paymentCount, { color: item.color }]}>
                {item.count}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {item.label}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    if (!netInfo.isConnected && !isLoading && !dashboardData) {
      return (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineIcon}>📡</Text>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 16 }}
          >
            You&apos;re Offline
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}
          >
            Please check your internet connection and try again.
          </Text>
          <Button
            mode="contained"
            onPress={handleRefresh}
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          >
            Retry
          </Button>
        </View>
      );
    }

    if (error && !dashboardData) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 16 }}
          >
            Something went wrong
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}
          >
            {error}
          </Text>
          <Button
            mode="contained"
            onPress={handleRefresh}
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          >
            Try Again
          </Button>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {renderStatsGrid()}

        {renderPaymentStatusSummary()}

        {renderPayoutSummary()}

        <View style={styles.section}>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 12 }}
          >
            Analytics
          </Text>
          {renderAnalytics()}
        </View>

        <View style={styles.section}>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 12 }}
          >
            Quick Actions
          </Text>
          <DashboardQuickActions
            subscriptionExpired={subscription?.is_subscription_expired || false}
            planLimits={dashboardData?.plan_limits || []}
            onUpgrade={() => router.push('/(drawer)/(tabs)/subscription')}
          />
        </View>

        <View style={styles.section}>
          <DashboardPendingTasks
            tasks={dashboardData?.pending_tasks || null}
            isLoading={isLoading}
          />
        </View>

        <View style={styles.section}>
          <DashboardRecentActivity data={dashboardData?.recent || null} isLoading={isLoading} />
        </View>

        <View style={styles.section}>
          <DashboardNotifications
            preview
            onMarkAllRead={() => {
              showMessage({ message: 'All notifications marked as read', type: 'success' });
            }}
          />
        </View>

        <View style={styles.section}>
          <DashboardSubscriptionWidget
            subscription={subscription}
            featureUsage={featureUsage}
            planLimits={dashboardData?.plan_limits || []}
            onUpgrade={() => router.push('/(drawer)/(tabs)/subscription')}
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
  },
  subscriptionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  monthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
  },
  monthBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  headerIcon: {
    margin: 0,
  },
  scrollContent: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  paymentScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  paymentCard: {
    minWidth: 100,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  paymentCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  analyticsContainer: {
    paddingHorizontal: 16,
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  offlineIcon: {
    fontSize: 48,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 48,
  },
  retryButton: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 4,
    minWidth: 120,
  },
});
