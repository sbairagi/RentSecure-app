import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import RenterDashboardScreen from '@/features/renter-dashboard/screens/RenterDashboardScreen';

export default function RenterDashboardRoute() {
  return (
    <RouteGuard requireAuth requireRole={['renter']}>
      <PermissionGuard permissions={['dashboard:read']}>
        <RenterDashboardScreen />
      </PermissionGuard>
    </RouteGuard>
  );
}
