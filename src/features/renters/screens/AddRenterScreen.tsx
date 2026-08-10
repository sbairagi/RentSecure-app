import { Spacing } from '@/constants/theme';
import { useRenter } from '@/features/renters/hooks/useRenter';
import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, Title } from 'react-native-paper';
import { useCreateRenter } from '../hooks/useCreateRenter';
import { useRentersStore } from '../store/rentersStore';
import { RENTER_CONSTANTS } from '../constants/renters';
import { renterCreateSchema } from '../validations/renterSchema';
import type { RenterCreateFormData } from '../validations/renterSchema';
import { rentersRepository } from '../repository/rentersRepository';

export default function AddRenterScreen() {
  const router = useRouter();
  const { createRenter, isCreating, error } = useCreateRenter();
  const { subscriptionLimits } = useRentersStore();
  
  const [formData, setFormData] = useState<Partial<RenterCreateFormData>>({
    name: '',
    phone: '',
    rent_amount: '',
    start_date: new Date().toISOString().split('T')[0],
    unit: undefined,
    email: '',
    alternate_phone: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    end_date: '',
    notes: '',
    whatsapp_number: '',
    rent_due_date: '',
  });
  
  const [units, setUnits] = useState<Array<{id: number; label: string}>>([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    loadUnits();
  }, []);
  
  const loadUnits = async () => {
    try {
      const data = await rentersRepository.fetchUnits();
      const availableUnits = data
        .filter((u: any) => !u.current_renter)
        .map((u: any) => ({
          id: u.id,
          label: `${u.building_name || ''} - ${u.unit}`.trim(),
        }));
      setUnits(availableUnits);
    } catch {
      // handle error silently
    } finally {
      setLoadingUnits(false);
    }
  };
  
  const validateForm = (): boolean => {
    try {
      renterCreateSchema.parse(formData);
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
    if (!validateForm()) return;
    
    try {
      const renter = await createRenter(formData as RenterCreateFormData);
      router.replace(`/(drawer)/(tabs)/renters/${renter.id}`);
    } catch {
      // error handled by hook
    }
  };
  
  const isAtLimit = subscriptionLimits 
    ? subscriptionLimits.max_renters !== 'unlimited' && subscriptionLimits.current_renters >= subscriptionLimits.max_renters
    : false;
  
  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['renter:write']}>
        <FeatureLimitGuard featureKey="max_renters">
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <Title style={styles.title}>Add Renter</Title>
            
            {isAtLimit && (
              <View style={[styles.warningBanner, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.warningText, { color: '#d97706' }]}>
                  You have reached your renter limit. Please upgrade your plan.
                </Text>
                <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/upgrade')}>
                  Upgrade Plan
                </Button>
              </View>
            )}
            
            <TextInput
              label="Full Name *"
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
              label="Phone *"
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
              label="Rent Amount *"
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
              label="Start Date *"
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
              label="End Date (optional)"
              value={formData.end_date}
              onChangeText={(text) => setFormData({ ...formData, end_date: text })}
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
            />
            
            <TextInput
              label="Unit *"
              value={formData.unit ? String(formData.unit) : ''}
              onChangeText={() => {}}
              style={styles.input}
              mode="outlined"
              editable={false}
              error={!!validationErrors.unit}
              right={<TextInput.Icon icon="chevron-down" />}
            />
            {validationErrors.unit && (
              <Text style={styles.errorText}>{validationErrors.unit}</Text>
            )}
            
            <View style={styles.unitPicker}>
              {loadingUnits ? (
                <Text style={styles.helperText}>Loading units...</Text>
              ) : units.length === 0 ? (
                <Text style={styles.helperText}>No available units. Please add a unit first.</Text>
              ) : (
                units.map((unit) => (
                  <Button
                    key={unit.id}
                    mode={formData.unit === unit.id ? 'contained' : 'outlined'}
                    onPress={() => setFormData({ ...formData, unit: unit.id })}
                    style={styles.unitButton}
                  >
                    {unit.label}
                  </Button>
                ))
              )}
            </View>
            
            <TextInput
              label="Emergency Contact Name"
              value={formData.emergency_contact_name}
              onChangeText={(text) => setFormData({ ...formData, emergency_contact_name: text })}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Emergency Contact Number"
              value={formData.emergency_contact_number}
              onChangeText={(text) => setFormData({ ...formData, emergency_contact_number: text })}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
            />
            
            <TextInput
              label="WhatsApp Number"
              value={formData.whatsapp_number}
              onChangeText={(text) => setFormData({ ...formData, whatsapp_number: text })}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
            />
            
            <TextInput
              label="Rent Due Date"
              value={formData.rent_due_date}
              onChangeText={(text) => setFormData({ ...formData, rent_due_date: text })}
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
              <Button mode="outlined" onPress={() => router.back()} disabled={isCreating}>
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSubmit} 
                loading={isCreating} 
                disabled={isCreating || isAtLimit}
              >
                Add Renter
              </Button>
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
  helperText: {
    color: '#6b7280',
    fontSize: 14,
    marginVertical: Spacing.sm,
  },
  unitPicker: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  unitButton: {
    marginVertical: Spacing.xs / 2,
  },
  warningBanner: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  warningText: {
    fontSize: 14,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
});