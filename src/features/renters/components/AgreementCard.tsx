import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import type { AgreementCardProps } from '../types';

const AGREEMENT_STATUS_COLORS: Record<string, string> = {
  active: '#16a34a',
  expired: '#dc2626',
  pending: '#d97706',
  terminated: '#6b7280',
};

export const AgreementCard: React.FC<AgreementCardProps> = ({ agreement }) => {
  const theme = useTheme();

  const isExpired = new Date(agreement.agreement_end_date) < new Date();
  const status = agreement.is_active ? 'active' : 'expired';

  return (
    <Card style={[styles.card, { backgroundColor: theme.card }]}>
      <Card.Content>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Rental Agreement</Text>
            <Text
              style={[styles.status, { color: AGREEMENT_STATUS_COLORS[status] || theme.subText }]}
            >
              {status.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.dates}>
          <View style={styles.dateRow}>
            <Text style={[styles.label, { color: theme.subText }]}>Start:</Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {new Date(agreement.agreement_start_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={[styles.label, { color: theme.subText }]}>End:</Text>
            <Text style={[styles.value, { color: isExpired ? theme.danger : theme.text }]}>
              {new Date(agreement.agreement_end_date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Card.Content>
      {agreement.document && (
        <Card.Actions style={styles.actions}>
          <IconButton
            icon="file-pdf"
            size={20}
            onPress={() => {}}
            accessible
            accessibilityRole="button"
            accessibilityLabel="View agreement PDF"
          />
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dates: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  actions: {
    justifyContent: 'flex-end',
  },
});
