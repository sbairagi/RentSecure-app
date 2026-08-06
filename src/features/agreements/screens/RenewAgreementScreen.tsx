import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAgreement } from '../hooks/useAgreement';
import { useUpdateAgreement } from '../hooks/useUpdateAgreement';

export default function RenewAgreementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agreement } = useAgreement(Number(id));
  const { updateAgreement, isUpdating } = useUpdateAgreement();
  const [endDate, setEndDate] = useState('');
  const theme = useTheme();

  const handleRenew = async () => {
    if (!agreement || !endDate) return;
    await updateAgreement(agreement.id, {
      agreement_end_date: endDate,
      is_agreement_revoked: false,
      revoked_by_owner: false,
      revocation_reason: '',
      revoked_on: null,
    });
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Renew Agreement</Text>
      <View style={styles.form}>
        <Text style={[styles.label, { color: '#374151' }]}>New End Date</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827' }]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#9ca3af"
          value={endDate}
          onChangeText={setEndDate}
          accessible
          accessibilityLabel="New end date"
        />
        <TouchableOpacity
          onPress={handleRenew}
          disabled={isUpdating}
          style={[styles.submitButton, { backgroundColor: isUpdating ? '#9ca3af' : '#16a34a' }]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Renew agreement"
        >
          <Text style={styles.submitButtonText}>
            {isUpdating ? 'Renewing...' : 'Renew Agreement'}
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
