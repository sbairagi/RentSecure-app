import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import type { PaymentLink } from '../types/payments';

interface PaymentLinkCardProps {
  link: PaymentLink;
  onCopy?: () => void;
  onShare?: () => void;
  onOpen?: () => void;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
}

export const PaymentLinkCard: React.FC<PaymentLinkCardProps> = ({
  link,
  onCopy,
  onShare,
  onOpen,
  onRegenerate,
  canRegenerate = true,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Payment Link</Text>
        <View style={[styles.statusBadge, { backgroundColor: link.is_active ? '#D1FAE5' : '#FEE2E2' }]}>
          <Text style={[styles.statusText, { color: link.is_active ? '#059669' : '#DC2626' }]}>
            {link.is_active ? 'Active' : 'Expired'}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.url, { color: theme.colors.primary }]} numberOfLines={1}>
          {link.url}
        </Text>
        {link.qr_code && (
          <Text style={[styles.qrLabel, { color: theme.colors.onSurfaceVariant }]}>
            QR Code Available
          </Text>
        )}
        {link.expires_at && (
          <Text style={[styles.expiry, { color: theme.colors.onSurfaceVariant }]}>
            Expires: {link.expires_at}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {onCopy && (
          <IconButton
            icon="content-copy"
            size={18}
            onPress={onCopy}
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
        {onOpen && (
          <IconButton
            icon="open-in-new"
            size={18}
            onPress={onOpen}
            iconColor={theme.colors.primary}
          />
        )}
        {canRegenerate && onRegenerate && (
          <IconButton
            icon="refresh"
            size={18}
            onPress={onRegenerate}
            iconColor={theme.colors.primary}
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
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
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
  url: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  qrLabel: {
    fontSize: 12,
  },
  expiry: {
    fontSize: 12,
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
