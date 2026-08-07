import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams } from 'expo-router';
import { validateMaintenanceExpense, type MaintenanceExpenseFormData } from '../validations';

export default function AddExpenseScreen() {
  const theme = useTheme();
  const _params = useLocalSearchParams<{ id: string }>();
  const [formData, setFormData] = useState<MaintenanceExpenseFormData>({
    description: '',
    estimated_cost: '',
    actual_cost: '',
    vendor_cost: '',
    material_cost: '',
    labour_cost: '',
    additional_charges: '0',
    payment_status: 'pending',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const result = validateMaintenanceExpense(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    // API call would go here
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['maintenance:write']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Description</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="e.g., Pipe replacement"
                placeholderTextColor={theme.textSecondary}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
            <View style={styles.row}>
              <View style={[styles.field, styles.halfField]}>
                <Text style={[styles.label, { color: theme.text }]}>Estimated Cost (₹)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  value={formData.estimated_cost}
                  onChangeText={(text) => setFormData({ ...formData, estimated_cost: text })}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.field, styles.halfField]}>
                <Text style={[styles.label, { color: theme.text }]}>Actual Cost (₹)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  value={formData.actual_cost}
                  onChangeText={(text) => setFormData({ ...formData, actual_cost: text })}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.field, styles.halfField]}>
                <Text style={[styles.label, { color: theme.text }]}>Vendor Cost (₹)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  value={formData.vendor_cost}
                  onChangeText={(text) => setFormData({ ...formData, vendor_cost: text })}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.field, styles.halfField]}>
                <Text style={[styles.label, { color: theme.text }]}>Material Cost (₹)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  value={formData.material_cost}
                  onChangeText={(text) => setFormData({ ...formData, material_cost: text })}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.field, styles.halfField]}>
                <Text style={[styles.label, { color: theme.text }]}>Labour Cost (₹)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  value={formData.labour_cost}
                  onChangeText={(text) => setFormData({ ...formData, labour_cost: text })}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.field, styles.halfField]}>
                <Text style={[styles.label, { color: theme.text }]}>Additional Charges (₹)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  value={formData.additional_charges}
                  onChangeText={(text) => setFormData({ ...formData, additional_charges: text })}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.primary }]} onPress={handleSubmit}>
              <Text style={styles.submitText}>Add Expense</Text>
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
  form: {
    padding: 16,
    gap: 16,
  },
  field: {
    gap: 6,
  },
  halfField: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
