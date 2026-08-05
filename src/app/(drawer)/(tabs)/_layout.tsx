import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { SubscriptionGuard } from '@/navigation/components/SubscriptionGuard';
import { VersionGuard } from '@/navigation/components/VersionGuard';
import { mapBackendRole, type UserRole } from '@/navigation/types/navigation.types';
import { ROLE_TAB_ACCESS } from '@/navigation/utils/roleRedirect';
import { useAuthStore } from '@/store/authStore';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const BASE_TABS = [
  {
    name: 'dashboard',
    title: 'Home',
    icon: '📊',
  },
  {
    name: 'properties',
    title: 'Properties',
    icon: '🏢',
  },
  {
    name: 'payments',
    title: 'Payments',
    icon: '💳',
  },
  {
    name: 'notifications',
    title: 'Alerts',
    icon: '🔔',
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: '👤',
  },
] as const;

export default function DrawerTabsLayout() {
  const theme = useTheme();
  const { user } = useAuthStore();
  const currentRole: UserRole = mapBackendRole(user?.role);
  const allowedTabs = ROLE_TAB_ACCESS[currentRole] || [];
  const tabs = BASE_TABS.filter((tab) => allowedTabs.includes(tab.name));

  return (
    <RouteGuard requireAuth>
      <VersionGuard>
        <SubscriptionGuard>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: theme.primary as string,
              tabBarInactiveTintColor: theme.subText as string,
              tabBarStyle: {
                backgroundColor: theme.card,
                borderTopColor: theme.border,
                height: 80,
                paddingBottom: 24,
                paddingTop: 8,
              },
              headerShown: false,
            }}
          >
            {tabs.map((tab) => (
              <Tabs.Screen
                key={tab.name}
                name={tab.name}
                options={{
                  title: tab.title,
                  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                    <Text style={{ fontSize: size, color }}>{tab.icon}</Text>
                  ),
                }}
              />
            ))}
            <Tabs.Screen
              name="subscription"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="support"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="reports"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="agreements"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="buildings"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="units"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="renters"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers"
              options={{
                href: null,
              }}
            />
          </Tabs>
        </SubscriptionGuard>
      </VersionGuard>
    </RouteGuard>
  );
}
