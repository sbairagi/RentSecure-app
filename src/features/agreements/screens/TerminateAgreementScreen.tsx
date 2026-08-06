import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAgreement } from '../hooks/useAgreement';
import { useUpdateAgreement } from '../hooks/useUpdateAgreement';

export default function TerminateAgreementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agreement } = useAgreement(Number(id));
  const { updateAgreement, isUpdating } = useUpdateAgreement();
  const [reason, setReason] = useState('');
  const theme = useTheme();

  const handleTerminate = async () => {
    if (!agreement) return;
    await updateAgreement(agreement.id, {
      is_agreement_revoked: true,
      revoked_by_owner: true,
      revocation_reason: reason,
      revoked_on: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Terminate Agreement</Text>
      <View style={styles.form}>
        <Text style={[styles.label, { color: '#374151' }]}>Reason for Termination</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827' }]}
          placeholder="Enter termination reason"
          placeholderTextColor="#9ca3af"
          value={reason}
          onChangeText={setReason}
          multiline
          accessible
          accessibilityLabel="Termination reason"
        />
        <TouchableOpacity
          onPress={handleTerminate}
          disabled={isUpdating}
          style={[styles.submitButton, { backgroundColor: isUpdating ? '#9ca3af' : '#dc2626' }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Terminate agreement"
        >
          <Text style={styles.submitButtonText}>
            {isUpdating ? 'Terminating...' : 'Terminate Agreement'}
          </Text>
        </TouchableOpacity>
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
  form: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
