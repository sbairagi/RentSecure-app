import { Spacing } from '@/constants/theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAgreement } from '../hooks/useAgreement';
import { useUpdateAgreement } from '../hooks/useUpdateAgreement';
import { agreementUpdateSchema } from '../validations/agreementSchema';

export default function EditDraftScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agreement, isLoading, error, refresh } = useAgreement(Number(id));
  const { updateAgreement, isUpdating } = useUpdateAgreement();
  const [formData, setFormData] = useState({
    agreement_start_date: '',
    agreement_end_date: '',
    rent_amount: '',
    security_deposit: '',
    notes: '',
    witness_name: '',
    witness_phone: '',
    witness_address: '',
  });

  React.useEffect(() => {
    if (agreement) {
      setFormData({
        agreement_start_date: agreement.agreement_start_date,
        agreement_end_date: agreement.agreement_end_date,
        rent_amount: agreement.rent_amount,
        security_deposit: agreement.security_deposit,
        notes: agreement.notes,
        witness_name: '',
        witness_phone: '',
        witness_address: '',
      });
    }
  }, [agreement]);

  const handleSubmit = async () => {
    const result = agreementUpdateSchema.safeParse(formData);
    if (!result.success) return;
    await updateAgreement(Number(id), result.data);
    router.back();
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['agreement:write']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !agreement) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['agreement:write']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.errorText}>{error || 'Agreement not found'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['agreement:write']}>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <Text style={[styles.title, { color: '#111827' }]}>Edit Agreement</Text>
          <View style={styles.form}>
            {[
              { key: 'agreement_start_date', label: 'Start Date', placeholder: 'YYYY-MM-DD' },
              { key: 'agreement_end_date', label: 'End Date', placeholder: 'YYYY-MM-DD' },
              { key: 'rent_amount', label: 'Rent Amount', placeholder: 'Enter rent amount' },
              { key: 'security_deposit', label: 'Security Deposit', placeholder: 'Enter deposit' },
              { key: 'notes', label: 'Notes', placeholder: 'Enter notes' },
              { key: 'witness_name', label: 'Witness Name', placeholder: 'Enter witness name' },
              { key: 'witness_phone', label: 'Witness Phone', placeholder: 'Enter witness phone' },
              { key: 'witness_address', label: 'Witness Address', placeholder: 'Enter witness address' },
            ].map((field) => (
              <View key={field.key} style={styles.field}>
                <Text style={[styles.label, { color: '#374151' }]}>{field.label}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827' }]}
                  placeholder={field.placeholder}
                  placeholderTextColor="#9ca3af"
                  value={formData[field.key as keyof typeof formData]}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, [field.key]: text }))
                  }
                  accessible
                  accessibilityLabel={field.label}
                />
              </View>
            ))}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isUpdating}
              style={[styles.submitButton, { backgroundColor: isUpdating ? '#9ca3af' : '#4f46e5' }]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Update agreement"
            >
              <Text style={styles.submitButtonText}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  form: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  field: {
    marginBottom: Spacing.sm,
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
  errorText: {
    color: '#dc2626',
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
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
  retryButton: {
    marginTop: Spacing.md,
    backgroundColor: '#4f46e5',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
