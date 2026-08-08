import { ROLE_LABELS } from '@/constants/auth.constants';
import { useNavigationAnalytics } from '@/navigation/hooks/useNavigationAnalytics';
import { mapBackendRole, type UserRole } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'expo-router';
import { Drawer, DrawerContentComponentProps } from 'expo-router/drawer';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const DRAWER_ITEMS: Record<UserRole, { label: string; icon: string; href: string }[]> = {
  super_admin: [
    { label: 'Dashboard', icon: '📊', href: '/(drawer)/(tabs)/dashboard' },
    { label: 'Properties', icon: '🏢', href: '/(drawer)/(tabs)/properties' },
    { label: 'Payments', icon: '💳', href: '/(drawer)/(tabs)/payments' },
    { label: 'Payment History', icon: '📋', href: '/(drawer)/(tabs)/payments/history' },
    { label: 'Overdue Payments', icon: '⚠️', href: '/(drawer)/(tabs)/payments/overdue' },
    { label: 'Invoices', icon: '📄', href: '/(drawer)/(tabs)/payments/invoices' },
    { label: 'Payout Status', icon: '💰', href: '/(drawer)/(tabs)/payments/payouts' },
    { label: 'Payment Analytics', icon: '📈', href: '/(drawer)/(tabs)/payments/analytics' },
    { label: 'Notifications', icon: '🔔', href: '/(drawer)/(tabs)/notifications' },
    { label: 'AI Assistant', icon: '🤖', href: '/(drawer)/(tabs)/ai-assistant' },
    { label: 'Reports', icon: '📈', href: '/(drawer)/(tabs)/reports' },
    { label: 'Agreements', icon: '📄', href: '/(drawer)/(tabs)/agreements' },
    { label: 'Settings', icon: '⚙️', href: '/(drawer)/(tabs)/settings' },
    { label: 'Support', icon: '💬', href: '/(drawer)/(tabs)/support' },
    { label: 'Subscription', icon: '⭐', href: '/(drawer)/(tabs)/subscription' },
    { label: 'Profile', icon: '👤', href: '/(drawer)/(tabs)/profile' },
  ],
  admin: [
    { label: 'Dashboard', icon: '📊', href: '/(drawer)/(tabs)/dashboard' },
    { label: 'Properties', icon: '🏢', href: '/(drawer)/(tabs)/properties' },
    { label: 'Payments', icon: '💳', href: '/(drawer)/(tabs)/payments' },
    { label: 'Payment History', icon: '📋', href: '/(drawer)/(tabs)/payments/history' },
    { label: 'Overdue Payments', icon: '⚠️', href: '/(drawer)/(tabs)/payments/overdue' },
    { label: 'Invoices', icon: '📄', href: '/(drawer)/(tabs)/payments/invoices' },
    { label: 'Payout Status', icon: '💰', href: '/(drawer)/(tabs)/payments/payouts' },
    { label: 'Payment Analytics', icon: '📈', href: '/(drawer)/(tabs)/payments/analytics' },
    { label: 'Notifications', icon: '🔔', href: '/(drawer)/(tabs)/notifications' },
    { label: 'AI Assistant', icon: '🤖', href: '/(drawer)/(tabs)/ai-assistant' },
    { label: 'Reports', icon: '📈', href: '/(drawer)/(tabs)/reports' },
    { label: 'Agreements', icon: '📄', href: '/(drawer)/(tabs)/agreements' },
    { label: 'Settings', icon: '⚙️', href: '/(drawer)/(tabs)/settings' },
    { label: 'Support', icon: '💬', href: '/(drawer)/(tabs)/support' },
    { label: 'Profile', icon: '👤', href: '/(drawer)/(tabs)/profile' },
  ],
  property_owner: [
    { label: 'Dashboard', icon: '📊', href: '/(drawer)/(tabs)/dashboard' },
    { label: 'Properties', icon: '🏢', href: '/(drawer)/(tabs)/properties' },
    { label: 'Buildings', icon: '🏗️', href: '/(drawer)/(tabs)/buildings' },
    { label: 'Units', icon: '🚪', href: '/(drawer)/(tabs)/units' },
    { label: 'Renters', icon: '👥', href: '/(drawer)/(tabs)/renters' },
    { label: 'Caretakers', icon: '🛡️', href: '/(drawer)/(tabs)/caretakers' },
    { label: 'Visitors', icon: '📋', href: '/(drawer)/(tabs)/visitors' },
    { label: 'Payments', icon: '💳', href: '/(drawer)/(tabs)/payments' },
    { label: 'Payment History', icon: '📋', href: '/(drawer)/(tabs)/payments/history' },
    { label: 'Overdue Payments', icon: '⚠️', href: '/(drawer)/(tabs)/payments/overdue' },
    { label: 'Invoices', icon: '📄', href: '/(drawer)/(tabs)/payments/invoices' },
    { label: 'Payout Status', icon: '💰', href: '/(drawer)/(tabs)/payments/payouts' },
    { label: 'Payment Analytics', icon: '📈', href: '/(drawer)/(tabs)/payments/analytics' },
    { label: 'Agreements', icon: '📄', href: '/(drawer)/(tabs)/agreements' },
    { label: 'Notifications', icon: '🔔', href: '/(drawer)/(tabs)/notifications' },
    { label: 'AI Assistant', icon: '🤖', href: '/(drawer)/(tabs)/ai-assistant' },
    { label: 'Reports', icon: '📈', href: '/(drawer)/(tabs)/reports' },
    { label: 'Subscription', icon: '⭐', href: '/(drawer)/(tabs)/subscription' },
    { label: 'Settings', icon: '⚙️', href: '/(drawer)/(tabs)/settings' },
    { label: 'Support', icon: '💬', href: '/(drawer)/(tabs)/support' },
    { label: 'Profile', icon: '👤', href: '/(drawer)/(tabs)/profile' },
  ],
  renter: [
    { label: 'Dashboard', icon: '📊', href: '/(drawer)/(tabs)/dashboard' },
    { label: 'Rent Records', icon: '📋', href: '/(drawer)/(tabs)/payments' },
    { label: 'Agreements', icon: '📄', href: '/(drawer)/(tabs)/agreements' },
    { label: 'Notifications', icon: '🔔', href: '/(drawer)/(tabs)/notifications' },
    { label: 'Settings', icon: '⚙️', href: '/(drawer)/(tabs)/settings' },
    { label: 'Profile', icon: '👤', href: '/(drawer)/(tabs)/profile' },
  ],
  caretaker: [
    { label: 'Dashboard', icon: '📊', href: '/(drawer)/(tabs)/dashboard' },
    { label: 'Properties', icon: '🏢', href: '/(drawer)/(tabs)/properties' },
    { label: 'Buildings', icon: '🏗️', href: '/(drawer)/(tabs)/buildings' },
    { label: 'Units', icon: '🚪', href: '/(drawer)/(tabs)/units' },
    { label: 'Renters', icon: '👥', href: '/(drawer)/(tabs)/renters' },
    { label: 'Visitors', icon: '📋', href: '/(drawer)/(tabs)/visitors' },
    { label: 'Notifications', icon: '🔔', href: '/(drawer)/(tabs)/notifications' },
    { label: 'Reports', icon: '📈', href: '/(drawer)/(tabs)/reports' },
    { label: 'Settings', icon: '⚙️', href: '/(drawer)/(tabs)/settings' },
    { label: 'Profile', icon: '👤', href: '/(drawer)/(tabs)/profile' },
  ],
  ca_partner: [
    { label: 'Dashboard', icon: '📊', href: '/(drawer)/(tabs)/dashboard' },
    { label: 'Properties', icon: '🏢', href: '/(drawer)/(tabs)/properties' },
    { label: 'Renters', icon: '👥', href: '/(drawer)/(tabs)/renters' },
    { label: 'Reports', icon: '📈', href: '/(drawer)/(tabs)/reports' },
    { label: 'Agreements', icon: '📄', href: '/(drawer)/(tabs)/agreements' },
    { label: 'Notifications', icon: '🔔', href: '/(drawer)/(tabs)/notifications' },
    { label: 'Settings', icon: '⚙️', href: '/(drawer)/(tabs)/settings' },
    { label: 'Profile', icon: '👤', href: '/(drawer)/(tabs)/profile' },
  ],
  support_executive: [
    { label: 'Dashboard', icon: '📊', href: '/(drawer)/(tabs)/dashboard' },
    { label: 'Properties', icon: '🏢', href: '/(drawer)/(tabs)/properties' },
    { label: 'Renters', icon: '👥', href: '/(drawer)/(tabs)/renters' },
    { label: 'Payments', icon: '💳', href: '/(drawer)/(tabs)/payments' },
    { label: 'Reports', icon: '📈', href: '/(drawer)/(tabs)/reports' },
    { label: 'Support', icon: '💬', href: '/(drawer)/(tabs)/support' },
    { label: 'Notifications', icon: '🔔', href: '/(drawer)/(tabs)/notifications' },
    { label: 'Settings', icon: '⚙️', href: '/(drawer)/(tabs)/settings' },
    { label: 'Profile', icon: '👤', href: '/(drawer)/(tabs)/profile' },
  ],
  user: [],
};

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const currentRole: UserRole = mapBackendRole(user?.role);
  const { trackScreenView } = useNavigationAnalytics();

  const items = DRAWER_ITEMS[currentRole] || [];

  const handleNavigate = useCallback(
    (href: string, label: string) => {
      trackScreenView(label);
      router.replace(href as any);
    },
    [router, trackScreenView]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/(auth)/welcome');
  }, [logout, router]);

  const isActive = useCallback(
    (href: string) => {
      return pathname === href || pathname.startsWith(href + '/');
    },
    [pathname]
  );

  return (
    <View style={styles.drawerContent}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.fullName?.charAt(0)?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
        <Text style={styles.userRole}>{ROLE_LABELS[currentRole]}</Text>
        {user?.email ? (
          <Text style={styles.userEmail} numberOfLines={1}>
            {user.email}
          </Text>
        ) : null}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        {items.map((item) => (
          <Pressable
            key={item.href}
            style={({ pressed }) => [
              styles.drawerItem,
              isActive(item.href) && styles.activeDrawerItem,
              pressed && styles.pressedDrawerItem,
            ]}
            onPress={() => handleNavigate(item.href, item.label)}
          >
            <Text style={styles.drawerIcon}>{item.icon}</Text>
            <Text style={[styles.drawerLabel, isActive(item.href) && styles.activeDrawerLabel]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.divider} />

      <Pressable
        style={({ pressed }) => [styles.logoutButton, pressed && styles.pressedLogoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutLabel}>Logout</Text>
      </Pressable>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerPosition: 'left',
        overlayColor: 'rgba(0,0,0,0.5)',
        swipeEnabled: true,
        swipeMinDistance: 50,
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: 'SecureNest' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 48,
    backgroundColor: '#f8f9fa',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userRole: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  section: {
    paddingVertical: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  activeDrawerItem: {
    backgroundColor: '#eef2ff',
  },
  pressedDrawerItem: {
    backgroundColor: '#e0e7ff',
  },
  drawerIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  drawerLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  activeDrawerLabel: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  pressedLogoutButton: {
    backgroundColor: '#fee2e2',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  logoutLabel: {
    fontSize: 15,
    color: '#dc2626',
    fontWeight: '600',
  },
});
