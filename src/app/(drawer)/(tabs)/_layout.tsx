import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { SubscriptionGuard } from '@/navigation/components/SubscriptionGuard';
import { VersionGuard } from '@/navigation/components/VersionGuard';
import { mapBackendRole, type UserRole } from '@/navigation/types/navigation.types';
import { ROLE_TAB_ACCESS } from '@/navigation/utils/roleRedirect';
import { useAuthStore } from '@/store/authStore';
import { Tabs } from 'expo-router';
import { type ColorValue } from 'react-native';
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
                  tabBarIcon: ({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) => (
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
              name="ai-assistant"
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
            <Tabs.Screen
              name="caretakers/[id]"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/assignment"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/permissions"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/building-access"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/unit-access"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/activity"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/documents"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/notifications"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/deactivate"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/delete"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/list"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/create"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/[id]"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/[id]/approval"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/[id]/history"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/[id]/documents"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/qr-scanner"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/qr-display"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/verify"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/entry"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="visitors/exit"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/add"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="caretakers/[id]/edit"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/dashboard"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/create"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]/edit"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]/update-status"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]/assign-caretaker"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]/assign-vendor"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]/add-comment"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]/add-expense"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]/upload-photos"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]/upload-documents"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/[id]/timeline"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/resolved"
              options={{
                href: null,
              }}
            />
            <Tabs.Screen
              name="maintenance/closed"
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
