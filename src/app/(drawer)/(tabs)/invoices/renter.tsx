import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import RenterInvoiceListScreen from '@/features/renter-dashboard/screens/RenterInvoiceListScreen';

export default function RenterInvoicesRoute() {
  const theme = useTheme();

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <RenterInvoiceListScreen />
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}
