import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { SubscriptionGuard } from '@/navigation/components/SubscriptionGuard';
import { Stack } from 'expo-router';

export default function SubscriptionLayout() {
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <SubscriptionGuard>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#ffffff',
              },
              headerTintColor: '#000000',
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          />
        </SubscriptionGuard>
      </PermissionGuard>
    </RouteGuard>
  );
}
