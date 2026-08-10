import { AnimatedBarChart } from '@/components/charts/AnimatedBarChart';
import { AnimatedLineChart } from '@/components/charts/AnimatedLineChart';
import { SkeletonChart, SkeletonStatCard } from '@/components/loaders/SkeletonCard';
import {
  DashboardNotifications,
  DashboardPendingTasks,
  DashboardQuickActions,
  DashboardRecentActivity,
  DashboardStatsCard,
  DashboardSubscriptionWidget,
} from '@/features/dashboard/components';
import { useDashboard } from '@/features/dashboard/hooks';
import type { FeatureUsage, PlanLimit, SubscriptionPlan } from '@/features/dashboard/types/dashboard';
import { useAuthStore } from '@/store/authStore';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Avatar, Button, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_COLUMNS = SCREEN_WIDTH > 768 ? 4 : 2;

export default function OwnerDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const netInfo = useNetInfo();
  const user = useAuthStore((s) => s.user);

  const { data: dashboardData, summary, isLoading, error, pullToRefresh } = useDashboard();

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

  const unreadCount = dashboardData?.notifications?.unread_count || 0;

  const subscription: SubscriptionPlan | null = dashboardData?.subscription || null;
  const planLimits: PlanLimit[] = dashboardData?.plan_limits || [];
  const featureUsage: FeatureUsage[] = dashboardData?.feature_usage || [];

  const isSubscriptionExpired = useMemo(() => {
    if (!subscription) return false;
    return subscription.is_subscription_expired;
  }, [subscription]);

  const stats = useMemo(() => {
    if (!dashboardData?.stats) return null;
    const s = dashboardData.stats;
    return [
      {
        title: 'Total Buildings',
        value: s.total_buildings,
        icon: '🏢',
        color: '#2563EB',
      },
      {
        title: 'Total Units',
        value: s.total_units,
        icon: '🚪',
        color: '#059669',
      },
      {
        title: 'Occupied Units',
        value: s.occupied_units,
        icon: '👥',
        color: '#D97706',
      },
      {
        title: 'Vacant Units',
        value: s.vacant_units,
        icon: '🔓',
        color: '#DC2626',
      },
      {
        title: 'Active Renters',
        value: s.active_renters,
        icon: '👤',
        color: '#7C3AED',
      },
      {
        title: 'Caretakers',
        value: s.caretakers,
        icon: '🔑',
        color: '#0891B2',
      },
      {
        title: 'Monthly Collection',
        value: `₹${s.monthly_collection}`,
        icon: '💰',
        color: '#059669',
      },
      {
        title: 'Pending Collection',
        value: `₹${s.pending_collection}`,
        icon: '⏳',
        color: '#D97706',
      },
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

  const recentPayments = dashboardData?.recent?.rent_payments || [];
  const payouts = dashboardData?.payouts || { success: 0, pending: 0, failed: 0 };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.headerLeft}>
        <Avatar.Text
          size={48}
          label={userName.charAt(0).toUpperCase()}
          style={{
            backgroundColor: theme.colors.primaryContainer,
          }}
          labelStyle={{
            color: theme.colors.onPrimaryContainer,
            fontSize: 20,
          }}
        />
        <View style={styles.headerText}>
          <Text
            variant="headlineSmall"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
            }}
          >
            {greeting}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {userName}
          </Text>
        </View>
      </View>
      <View style={styles.headerRight}>
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
          icon="magnify"
          size={24}
          onPress={() => router.push('/(drawer)/(tabs)/search')}
          style={styles.headerIcon}
          iconColor={theme.colors.onSurfaceVariant}
          accessibilityLabel="Search"
          accessibilityHint="Open global search"
        />
        <View style={styles.headerIcon}>
          <IconButton
            icon="bell-outline"
            size={24}
            onPress={() => router.push('/(drawer)/(tabs)/notifications')}
            iconColor={theme.colors.onSurfaceVariant}
            accessibilityLabel="Notifications"
            accessibilityHint="Open notifications"
          />
          {unreadCount > 0 && (
            <View
              style={[
                styles.notificationBadge,
                { backgroundColor: '#EF4444' },
              ]}
            >
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 99 ? '99+' : String(unreadCount)}
              </Text>
            </View>
          )}
        </View>
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
            <View
              key={i}
              style={{
                flex: 1 / GRID_COLUMNS,
                marginHorizontal: 4,
                marginBottom: 12,
              }}
            >
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
            style={{
              flex: 1 / GRID_COLUMNS,
              marginHorizontal: 4,
              marginBottom: 12,
            }}
          >
            <DashboardStatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderFinancialSummary = () => {
    if (isLoading || !summary) {
      return (
        <View style={styles.financialCard}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading financial summary...</Text>
        </View>
      );
    }

    const financialItems = [
      {
        label: 'Total Rent Collected',
        value: `₹${summary.total_rent_collected}`,
        icon: '💰',
        color: '#059669',
      },
      {
        label: 'Pending Rent',
        value: `₹${summary.pending_rent}`,
        icon: '⏳',
        color: '#D97706',
      },
      {
        label: 'Payouts Success',
        value: payouts.success.toString(),
        icon: '✅',
        color: '#059669',
      },
      {
        label: 'Payouts Pending',
        value: payouts.pending.toString(),
        icon: '🔄',
        color: '#D97706',
      },
    ];

    return (
      <View style={styles.financialGrid}>
        {financialItems.map((item) => (
          <View key={item.label} style={[styles.financialItem, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={styles.financialIcon}>{item.icon}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              {item.label}
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 2 }}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderRecentPayments = () => {
    if (isLoading) {
      return (
        <View style={styles.recentPaymentsContainer}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading recent payments...</Text>
        </View>
      );
    }

    if (recentPayments.length === 0) {
      return (
        <View style={styles.recentPaymentsContainer}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>No rent payments yet.</Text>
        </View>
      );
    }

    return (
      <View style={styles.recentPaymentsContainer}>
        {recentPayments.slice(0, 5).map((payment) => (
          <View
            key={payment.id}
            style={[
              styles.paymentItem,
              { borderBottomColor: theme.colors.outlineVariant },
            ]}
          >
            <View style={styles.paymentLeft}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                {payment.renter_name || 'Unknown'}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                {payment.unit_name} {payment.building_name ? `• ${payment.building_name}` : ''}
              </Text>
            </View>
            <View style={styles.paymentRight}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                ₹{payment.amount}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                {payment.payment_method}
              </Text>
            </View>
          </View>
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
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
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

  const renderContent = () => {
    if (!netInfo.isConnected && !isLoading && !dashboardData) {
      return (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineIcon}>📡</Text>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
              marginTop: 16,
            }}
          >
            You&apos;re Offline
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              marginTop: 8,
              textAlign: 'center',
            }}
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
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
              marginTop: 16,
            }}
          >
            Unable to load dashboard
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              marginTop: 8,
              textAlign: 'center',
            }}
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

        {!isLoading && summary && (
          <View style={styles.section}>
            <Text
              variant="titleMedium"
              style={{
                color: theme.colors.onSurface,
                fontWeight: '600',
                marginBottom: 12,
              }}
            >
              Financial Summary
            </Text>
            {renderFinancialSummary()}
          </View>
        )}

        <View style={styles.section}>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
              marginBottom: 12,
            }}
          >
            Analytics
          </Text>
          {renderAnalytics()}
        </View>

        <View style={styles.section}>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
              marginBottom: 12,
            }}
          >
            Recent Rent Payments
          </Text>
          {renderRecentPayments()}
        </View>

        <View style={styles.section}>
          <Text
            variant="titleMedium"
            style={{
              color: theme.colors.onSurface,
              fontWeight: '600',
              marginBottom: 12,
            }}
          >
            Quick Actions
          </Text>
          <DashboardQuickActions
            subscriptionExpired={isSubscriptionExpired}
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
              showMessage({
                message: 'All notifications marked as read',
                type: 'success',
              });
            }}
          />
        </View>

        <View style={styles.section}>
          <DashboardSubscriptionWidget
            subscription={subscription}
            featureUsage={featureUsage}
            planLimits={planLimits}
            onUpgrade={() => router.push('/(drawer)/(tabs)/subscription')}
          />
        </View>

        {isSubscriptionExpired && (
          <View style={styles.section}>
            <View
              style={[
                styles.expiredBanner,
                { backgroundColor: `${theme.colors.error}15`, borderColor: theme.colors.error },
              ]}
            >
              <Text variant="bodyMedium" style={{ color: theme.colors.error, fontWeight: '600' }}>
                Your subscription has expired
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
              >
                Renew now to continue accessing all features.
              </Text>
              <Button
                mode="contained"
                onPress={() => router.push('/(drawer)/(tabs)/subscription')}
                style={[styles.renewButton, { backgroundColor: theme.colors.error }]}
                labelStyle={{ color: theme.colors.onError, fontWeight: '600' }}
              >
                Renew Subscription
              </Button>
            </View>
          </View>
        )}

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
  headerIcon: {
    margin: 0,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
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
  financialCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  financialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  financialItem: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  financialIcon: {
    fontSize: 24,
  },
  recentPaymentsContainer: {
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  paymentLeft: {
    flex: 1,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  expiredBanner: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  renewButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 4,
    minWidth: 160,
  },
});