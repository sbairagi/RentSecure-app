import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TextInput, Button, Portal, Modal } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRouter } from 'expo-router';
import { useCreateRentRecord } from '../hooks/useCreateRentRecord';
import { RentRecordCreatePayload } from '../types/rents';
import { RENT_CONSTANTS } from '../constants/rents';
import { getTodayISO, getFirstDayOfMonth } from '../utils/rentUtils';

export default function CreateRentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const createRent = useCreateRentRecord();
  const [formData, setFormData] = useState<RentRecordCreatePayload>({
    unit: 0,
    renter: null,
    amount: '',
    payment_method: 'upi',
    due_date: getFirstDayOfMonth(),
    late_fee: '0',
    discount: '0',
    notes: '',
    adjustment_reason: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [units, setUnits] = useState<{ id: number; name: string }[]>([]);
  const [renters, setRenters] = useState<{ id: number; name: string }[]>([]);
  const [showRenterModal, setShowRenterModal] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    if (parseFloat(formData.late_fee) < 0) newErrors.late_fee = 'Late fee cannot be negative';
    if (parseFloat(formData.discount) < 0) newErrors.discount = 'Discount cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createRent.mutateAsync(formData);
      router.back();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['rent:write']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Create Rent Record
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Record a new rent payment
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.colors.onSurface }]}>
              Unit {formData.unit ? `#${formData.unit}` : ''}
            </Text>
            <Button mode="outlined" onPress={() => setShowUnitModal(true)} style={styles.selector}>
              {formData.unit ? `Unit #${formData.unit}` : 'Select Unit'}
            </Button>
            {errors.unit && <Text style={[styles.error, { color: theme.colors.error }]}>{errors.unit}</Text>}

            <Text style={[styles.label, { color: theme.colors.onSurface }]}>
              Renter {formData.renter ? `#${formData.renter}` : ''}
            </Text>
            <Button mode="outlined" onPress={() => setShowRenterModal(true)} style={styles.selector}>
              {formData.renter ? `Renter #${formData.renter}` : 'Select Renter (Optional)'}
            </Button>

            <TextInput
              mode="outlined"
              label="Amount (₹)"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              keyboardType="decimal-pad"
              error={!!errors.amount}
              style={styles.input}
            />
            {errors.amount && <Text style={[styles.error, { color: theme.colors.error }]}>{errors.amount}</Text>}

            <TextInput
              mode="outlined"
              label="Due Date"
              value={formData.due_date}
              onChangeText={(text) => setFormData({ ...formData, due_date: text })}
              error={!!errors.due_date}
              style={styles.input}
            />
            {errors.due_date && <Text style={[styles.error, { color: theme.colors.error }]}>{errors.due_date}</Text>}

            <TextInput
              mode="outlined"
              label="Late Fee (₹)"
              value={formData.late_fee}
              onChangeText={(text) => setFormData({ ...formData, late_fee: text })}
              keyboardType="decimal-pad"
              error={!!errors.late_fee}
              style={styles.input}
            />
            {errors.late_fee && <Text style={[styles.error, { color: theme.colors.error }]}>{errors.late_fee}</Text>}

            <TextInput
              mode="outlined"
              label="Discount (₹)"
              value={formData.discount}
              onChangeText={(text) => setFormData({ ...formData, discount: text })}
              keyboardType="decimal-pad"
              error={!!errors.discount}
              style={styles.input}
            />
            {errors.discount && <Text style={[styles.error, { color: theme.colors.error }]}>{errors.discount}</Text>}

            <TextInput
              mode="outlined"
              label="Payment Method"
              value={formData.payment_method}
              onChangeText={(text) => setFormData({ ...formData, payment_method: text })}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Notes"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Adjustment Reason"
              value={formData.adjustment_reason}
              onChangeText={(text) => setFormData({ ...formData, adjustment_reason: text })}
              multiline
              numberOfLines={2}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={createRent.isPending}
              disabled={createRent.isPending}
              style={styles.submitButton}
            >
              Create Rent Record
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
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    padding: 16,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  selector: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'transparent',
  },
  error: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 4,
    marginTop: 16,
  },
});
