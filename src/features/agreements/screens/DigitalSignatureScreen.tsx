import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SignatureStatusCard } from '../components/SignatureStatusCard';
import { useAgreement } from '../hooks/useAgreement';

export default function DigitalSignatureScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agreement, isLoading, error, refresh } = useAgreement(Number(id));
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !agreement) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={styles.errorText}>{error || 'Agreement not found'}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Digital Signature</Text>
      <SignatureStatusCard agreement={agreement} />
      <View style={styles.actions}>
        {!agreement.owner_signed && (
          <TouchableOpacity
            onPress={() => alert('Owner signature initiated')}
            style={styles.actionButton}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Sign as owner"
          >
            <Text style={styles.actionButtonText}>Sign as Owner</Text>
          </TouchableOpacity>
        )}
        {!agreement.renter_signed && (
          <TouchableOpacity
            onPress={() => alert('Renter signature initiated')}
            style={[styles.actionButton, { backgroundColor: '#16a34a' }]}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Sign as renter"
          >
            <Text style={styles.actionButtonText}>Sign as Renter</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#dc2626',
  },
  actions: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#4f46e5',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
