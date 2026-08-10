import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import PaymentStatusScreen from '@/features/renter-dashboard/screens/PaymentStatusScreen';

export default function PaymentStatusRoute() {
  const theme = useTheme();

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <PaymentStatusScreen />
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}
