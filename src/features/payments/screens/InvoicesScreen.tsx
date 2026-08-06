import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { InvoiceCard, PaymentSkeletonLoader, PaymentEmptyState, PaymentErrorState } from '../components';
import { invoicesApi } from '../services/invoicesApi';
import { ERROR_MESSAGES } from '../constants/payments';

export default function InvoicesScreen() {
  const theme = useTheme();
  const netInfo = useNetInfo();
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await invoicesApi.list();
      setInvoices(data.results || []);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    await loadInvoices();
  }, []);

  const handleDownload = async (invoiceId: number | string) => {
    try {
      const blob = await invoicesApi.download(invoiceId);
      // Handle blob download
    } catch (err: any) {
      // Error handled
    }
  };

  const handleShare = async (invoiceId: number | string) => {
    try {
      await invoicesApi.share(invoiceId, { send_via: ['email', 'whatsapp'] });
    } catch (err: any) {
      // Error handled
    }
  };

  const handleSend = async (invoiceId: number | string) => {
    try {
      await invoicesApi.send(invoiceId);
    } catch (err: any) {
      // Error handled
    }
  };

  if (isLoading && !invoices.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentSkeletonLoader count={5} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !invoices.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentErrorState message={error} onRetry={handleRefresh} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Invoices
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {invoices.length} invoices
            </Text>
          </View>

          {!netInfo.isConnected && invoices.length === 0 ? (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineIcon}>📡</Text>
              <Text style={[styles.offlineText, { color: theme.colors.onSurface }]}>
                You're Offline
              </Text>
            </View>
          ) : invoices.length === 0 ? (
            <PaymentEmptyState
              title="No invoices found"
              description="Invoices will be generated automatically for rent records."
            />
          ) : (
            invoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onDownload={() => handleDownload(invoice.id)}
                onShare={() => handleShare(invoice.id)}
                onSend={() => handleSend(invoice.id)}
              />
            ))
          )}
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  offlineIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  offlineText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
});
