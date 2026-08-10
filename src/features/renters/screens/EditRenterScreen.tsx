import { Spacing } from '@/constants/theme';
import { useRenter } from '@/features/renters/hooks/useRenter';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, Title } from 'react-native-paper';
import { useUpdateRenter } from '../hooks/useUpdateRenter';
import { renterUpdateSchema } from '../validations/renterSchema';
import type { RenterUpdateFormData } from '../validations/renterSchema';

export default function EditRenterScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { renter, isLoading, error: fetchError } = useRenter(Number(id));
  const { updateRenter, isUpdating, error: updateError } = useUpdateRenter(Number(id));
  
  const [formData, setFormData] = useState<Partial<RenterUpdateFormData>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (renter) {
      setFormData({
        name: renter.name,
        phone: renter.phone,
        email: renter.email || '',
        alternate_phone: renter.alternate_phone || '',
        emergency_contact_name: renter.emergency_contact_name || '',
        emergency_contact_number: renter.emergency_contact_number || '',
        rent_amount: renter.rent_amount,
        start_date: renter.start_date,
        end_date: renter.end_date || '',
        notes: renter.notes || '',
        whatsapp_number: renter.whatsapp_number || '',
        rent_due_date: renter.rent_due_date || '',
        status: renter.status,
      });
    }
  }, [renter]);
  
  const validateForm = (): boolean => {
    if (!formData) return false;
    try {
      renterUpdateSchema.parse(formData);
      setValidationErrors({});
      return true;
    } catch (err: any) {
      const errors: Record<string, string> = {};
      if (err.errors) {
        err.errors.forEach((e: any) => {
          const path = e.path?.[0];
          if (path) errors[path] = e.message;
        });
      }
      setValidationErrors(errors);
      return false;
    }
  };
  
  const handleSubmit = async () => {
    if (!validateForm() || !renter) return;
    
    try {
      await updateRenter(formData as RenterUpdateFormData);
      router.back();
    } catch {
      // error handled by hook
    }
  };
  
  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['renter:write']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }
  
  if (!renter) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['renter:write']}>
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Text style={styles.errorScreenText}>Renter not found</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }
  
  const error = updateError || fetchError;
  
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['renter:write']}>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <Title style={styles.title}>Edit Renter</Title>
          
          <TextInput
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            style={styles.input}
            mode="outlined"
            error={!!validationErrors.name}
          />
          {validationErrors.name && (
            <Text style={styles.errorText}>{validationErrors.name}</Text>
          )}
          
          <TextInput
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
            error={!!validationErrors.phone}
          />
          {validationErrors.phone && (
            <Text style={styles.errorText}>{validationErrors.phone}</Text>
          )}
          
          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Rent Amount"
            value={formData.rent_amount}
            onChangeText={(text) => setFormData({ ...formData, rent_amount: text })}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            error={!!validationErrors.rent_amount}
          />
          {validationErrors.rent_amount && (
            <Text style={styles.errorText}>{validationErrors.rent_amount}</Text>
          )}
          
          <TextInput
            label="Start Date"
            value={formData.start_date}
            onChangeText={(text) => setFormData({ ...formData, start_date: text })}
            style={styles.input}
            mode="outlined"
            placeholder="YYYY-MM-DD"
            error={!!validationErrors.start_date}
          />
          {validationErrors.start_date && (
            <Text style={styles.errorText}>{validationErrors.start_date}</Text>
          )}
          
          <TextInput
            label="End Date"
            value={formData.end_date}
            onChangeText={(text) => setFormData({ ...formData, end_date: text })}
            style={styles.input}
            mode="outlined"
            placeholder="YYYY-MM-DD"
          />
          
          <TextInput
            label="Notes"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />
          
          {error && (
            <Text style={styles.formError}>{error}</Text>
          )}
          
          <View style={styles.actions}>
            <Button mode="outlined" onPress={() => router.back()} disabled={isUpdating}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSubmit} loading={isUpdating} disabled={isUpdating}>
              Save Changes
            </Button>
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  input: {
    marginBottom: Spacing.xs,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginBottom: Spacing.sm,
    marginTop: -Spacing.xs,
  },
  formError: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
  errorScreenText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#dc2626',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
});