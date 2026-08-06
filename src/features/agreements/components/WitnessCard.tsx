import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { WitnessCardProps } from '../types';

export const WitnessCard: React.FC<WitnessCardProps> = ({ witness }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: theme.text }]}>{witness.name}</Text>
        <Text style={[styles.phone, { color: theme.subText }]}>{witness.phone}</Text>
      </View>
      <View style={styles.details}>
        <Text style={[styles.label, { color: theme.subText }]}>Address:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{witness.address}</Text>
      </View>
      {witness.signed_at && (
        <Text style={[styles.signedAt, { color: theme.subText }]}>
          Signed on {new Date(witness.signed_at).toLocaleString()}
        </Text>
      )}
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
  header: {
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
  },
  details: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 4,
  },
  value: {
    fontSize: 13,
    flex: 1,
  },
  signedAt: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
