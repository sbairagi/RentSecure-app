import { Spacing } from '@/constants/theme';
import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCreateAgreement } from '../hooks/useCreateAgreement';
import { agreementCreateSchema } from '../validations/agreementSchema';

export default function CreateAgreementScreen() {
  const router = useRouter();
  const { createAgreement, isCreating, error } = useCreateAgreement();
  const [formData, setFormData] = useState({
    renter: '',
    unit: '',
    agreement_start_date: '',
    agreement_end_date: '',
    rent_amount: '',
    security_deposit: '',
    notes: '',
    witness_name: '',
    witness_phone: '',
    witness_address: '',
  });

  const handleSubmit = async () => {
    const result = agreementCreateSchema.safeParse(formData);
    if (!result.success) {
      return;
    }
    await createAgreement(result.data);
    router.back();
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['agreement:write']}>
        <FeatureLimitGuard featureKey="rent_agreement_drafts">
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={[styles.title, { color: '#111827' }]}>Create Agreement</Text>
            <View style={styles.form}>
              {[
                { key: 'renter', label: 'Renter ID', placeholder: 'Enter renter ID' },
                { key: 'unit', label: 'Unit ID', placeholder: 'Enter unit ID' },
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
                disabled={isCreating}
                style={[styles.submitButton, { backgroundColor: isCreating ? '#9ca3af' : '#4f46e5' }]}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Create agreement"
              >
                <Text style={styles.submitButtonText}>
                  {isCreating ? 'Creating...' : 'Create Agreement'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FeatureLimitGuard>
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
});
