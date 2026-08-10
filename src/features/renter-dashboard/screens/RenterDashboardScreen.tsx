import { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Avatar, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '@/store/authStore';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRenterDashboard } from '../hooks/useRenterDashboard';
import { RenterDashboardSkeleton } from '../components/RenterDashboardSkeleton';
import { PropertyCard } from '../components/PropertyCard';
import { RentSummaryCard } from '../components/RentSummaryCard';
import { PaymentCTA } from '../components/PaymentCTA';
import { PaymentHistoryPreview } from '../components/PaymentHistoryPreview';
import { AgreementCard } from '../components/AgreementCard';
import { MaintenanceSummary } from '../components/MaintenanceSummary';
import { NotificationsPreview } from '../components/NotificationsPreview';
import { EmptyRenterDashboard } from '../components/EmptyRenterDashboard';
import { DashboardErrorState } from '../components/DashboardErrorState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RenterDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const netInfo = useNetInfo();
  const user = useAuthStore((s) => s.user);

  const { dashboard, isLoading, error, refetch, refresh } = useRenterDashboard();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } catch {
      showMessage({ message: 'Failed to refresh dashboard', type: 'danger' });
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const userName = useMemo(() => {
    return dashboard?.profile?.name || user?.fullName || user?.firstName || 'User';
  }, [dashboard, user]);

  const initials = useMemo(() => {
    return userName.charAt(0).toUpperCase();
  }, [userName]);

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.headerLeft}>
        <Avatar.Text
          size={48}
          label={initials}
          style={{ backgroundColor: theme.colors.primaryContainer }}
          labelStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 20 }}
        />
        <View style={styles.headerText}>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.onSurface, fontWeight: '600' }}
          >
            Renter Dashboard
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {userName}
          </Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <IconButton
          icon="bell-outline"
          size={24}
          onPress={() => router.push('/(drawer)/(tabs)/notifications')}
          style={styles.headerIcon}
          iconColor={theme.colors.onSurfaceVariant}
        />
      </View>
    </View>
  );

  const renderContent = () => {
    if (!netInfo.isConnected && !isLoading && !dashboard) {
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
        </View>
      );
    }

    if (error && !dashboard) {
      return (
        <DashboardErrorState
          message={error}
          onRetry={handleRefresh}
        />
      );
    }

    if (!isLoading && !dashboard) {
      return <EmptyRenterDashboard />;
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
        {isLoading && !dashboard ? (
          <RenterDashboardSkeleton />
        ) : (
          <>
            {dashboard?.profile && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                <PropertyCard profile={dashboard.profile} onPress={() => router.push('/(drawer)/(tabs)/search')} />
              </Animated.View>
            )}

            {dashboard?.current_rent && (
              <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.section}>
                <RentSummaryCard rent={dashboard.current_rent} />
              </Animated.View>
            )}

            {dashboard?.current_rent && (
              <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.section}>
                <PaymentCTA
                  rent={dashboard.current_rent}
                  onPayPress={() => router.push({
                    pathname: '/(drawer)/(tabs)/payments/pay-rent',
                    params: { rentId: dashboard.current_rent!.id.toString() },
                  })}
                />
              </Animated.View>
            )}

            {dashboard?.recent_payments && dashboard.recent_payments.length > 0 && (
              <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.section}>
                <PaymentHistoryPreview
                  payments={dashboard.recent_payments}
                  onViewAll={() => router.push('/(drawer)/(tabs)/payments')}
                  onPressPayment={(payment) => router.push({
                    pathname: '/(drawer)/(tabs)/payment-details/[id]',
                    params: { id: payment.id.toString() },
                  })}
                />
              </Animated.View>
            )}

            {dashboard?.agreement && (
              <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.section}>
                <AgreementCard agreement={dashboard.agreement} onPress={() => router.push('/(drawer)/(tabs)/agreements')} />
              </Animated.View>
            )}

            {dashboard && dashboard.extra_charges_count > 0 && (
              <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.section}>
                <MaintenanceSummary
                  count={dashboard.extra_charges_count}
                  onPress={() => router.push('/(drawer)/(tabs)/maintenance')}
                />
              </Animated.View>
            )}

            <Animated.View entering={FadeInDown.duration(400).delay(350)} style={styles.section}>
              <NotificationsPreview
                unreadCount={dashboard?.notifications_unread_count || 0}
                onPress={() => router.push('/(drawer)/(tabs)/notifications')}
              />
            </Animated.View>

            <View style={{ height: 24 }} />
          </>
        )}
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
  headerIcon: {
    margin: 0,
  },
  scrollContent: {
    paddingTop: 16,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
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
});