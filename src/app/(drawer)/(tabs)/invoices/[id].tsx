import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams } from 'expo-router';
import RenterInvoiceDetailScreen from '@/features/renter-dashboard/screens/RenterInvoiceDetailScreen';

export default function RenterInvoiceDetailRoute() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ paymentId?: string }>();

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <RenterInvoiceDetailScreen />
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}
