import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import type { Invoice } from '../types/invoices';
import { PAYMENT_CONSTANTS } from '../constants/payments';
import { formatCurrency, formatDate } from '../utils/paymentUtils';

interface InvoiceCardProps {
  invoice: Invoice;
  onPress?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onSend?: () => void;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onPress,
  onDownload,
  onShare,
  onSend,
}) => {
  const theme = useTheme();
  const config = PAYMENT_CONSTANTS.INVOICE_STATUS_CONFIG[invoice.status as keyof typeof PAYMENT_CONSTANTS.INVOICE_STATUS_CONFIG] || PAYMENT_CONSTANTS.INVOICE_STATUS_CONFIG.draft;
  const label = PAYMENT_CONSTANTS.INVOICE_STATUS_LABELS[invoice.status as keyof typeof PAYMENT_CONSTANTS.INVOICE_STATUS_LABELS] || invoice.status;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.invoiceNumber, { color: theme.colors.onSurface }]}>
            {invoice.invoice_number}
          </Text>
          <Text style={[styles.renterInfo, { color: theme.colors.onSurfaceVariant }]}>
            {invoice.renter_name} • {invoice.unit_name}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.backgroundColor }]}>
          <Text style={[styles.statusText, { color: config.color }]}>
            {label}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.amountRow}>
          <Text style={[styles.amount, { color: theme.colors.onSurface }]}>
            {formatCurrency(invoice.total_amount)}
          </Text>
          {invoice.tax && parseFloat(invoice.tax) > 0 && (
            <Text style={[styles.tax, { color: theme.colors.onSurfaceVariant }]}>
              Tax: {formatCurrency(invoice.tax)}
            </Text>
          )}
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
            Date: {formatDate(invoice.invoice_date)}
          </Text>
          <Text style={[styles.dueDate, { color: theme.colors.onSurfaceVariant }]}>
            Due: {formatDate(invoice.due_date)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {onDownload && (
          <IconButton
            icon="download"
            size={18}
            onPress={onDownload}
            iconColor={theme.colors.primary}
          />
        )}
        {onShare && (
          <IconButton
            icon="share-variant"
            size={18}
            onPress={onShare}
            iconColor={theme.colors.primary}
          />
        )}
        {onSend && (
          <IconButton
            icon="send"
            size={18}
            onPress={onSend}
            iconColor={theme.colors.primary}
          />
        )}
        {onPress && (
          <IconButton
            icon="chevron-right"
            size={18}
            onPress={onPress}
            iconColor={theme.colors.onSurfaceVariant}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  renterInfo: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  body: {
    gap: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  tax: {
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 13,
  },
  dueDate: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 8,
  },
});
