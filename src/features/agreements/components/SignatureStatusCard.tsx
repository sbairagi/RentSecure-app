import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SignatureStatusCardProps } from '../types';

export const SignatureStatusCard: React.FC<SignatureStatusCardProps> = ({ agreement }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Signature Status</Text>
      <View style={styles.row}>
        <View style={styles.signer}>
          <Text style={[styles.label, { color: theme.subText }]}>Owner</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: agreement.owner_signed ? '#dcfce7' : '#fee2e2',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: agreement.owner_signed ? '#16a34a' : '#dc2626' },
              ]}
            >
              {agreement.owner_signed ? 'Signed' : 'Pending'}
            </Text>
          </View>
        </View>
        <View style={styles.signer}>
          <Text style={[styles.label, { color: theme.subText }]}>Renter</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: agreement.renter_signed ? '#dcfce7' : '#fee2e2',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: agreement.renter_signed ? '#16a34a' : '#dc2626' },
              ]}
            >
              {agreement.renter_signed ? 'Signed' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  signer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
