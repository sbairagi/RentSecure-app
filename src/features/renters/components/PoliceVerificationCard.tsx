import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import type { PoliceVerificationCardProps } from '../types';

const VERIFICATION_STATUS_COLORS: Record<string, string> = {
  verified: '#16a34a',
  pending: '#d97706',
  rejected: '#dc2626',
  not_submitted: '#6b7280',
};

export const PoliceVerificationCard: React.FC<PoliceVerificationCardProps> = ({
  verification,
  onUpload,
  onDownload,
}) => {
  const theme = useTheme();

  const status = verification.status || verification.verification_status || 'not_started';

  return (
    <Card style={[styles.card, { backgroundColor: theme.card }]}>
      <Card.Content>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Police Verification</Text>
            <Text
              style={[
                styles.status,
                { color: VERIFICATION_STATUS_COLORS[status] || theme.subText },
              ]}
            >
              {status.replace(/_/g, ' ').toUpperCase()}
            </Text>
          </View>
        </View>
        {(verification.submitted_at || verification.verification_date) && (
          <Text style={[styles.date, { color: theme.subText }]}>
            Submitted:{' '}
            {new Date(
              verification.submitted_at || verification.verification_date || ''
            ).toLocaleDateString()}
          </Text>
        )}
        {verification.verified_at && (
          <Text style={[styles.date, { color: theme.subText }]}>
            Verified: {new Date(verification.verified_at).toLocaleDateString()}
          </Text>
        )}
        {verification.notes && (
          <Text style={[styles.notes, { color: theme.subText }]}>{verification.notes}</Text>
        )}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <IconButton
          icon="upload"
          size={18}
          onPress={onUpload}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Upload verification document"
        />
        {(verification.file || verification.document) && (
          <IconButton
            icon="download"
            size={18}
            onPress={onDownload}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Download verification document"
          />
        )}
      </Card.Actions>
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
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 13,
    marginTop: Spacing.xs,
  },
  notes: {
    fontSize: 13,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  actions: {
    justifyContent: 'flex-end',
  },
});
