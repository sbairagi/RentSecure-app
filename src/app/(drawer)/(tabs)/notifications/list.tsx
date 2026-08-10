import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import NotificationCenterScreen from '@/features/notifications/screens/NotificationCenterScreen';

export default function NotificationsListScreen() {
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['notification:read']}>
        <NotificationCenterScreen />
      </PermissionGuard>
    </RouteGuard>
  );
}
