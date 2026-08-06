import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TextInput, Button, Portal, Modal } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRouter } from 'expo-router';
import { useCollectRent } from '../hooks';
import { collectRentSchema } from '../validations';
import { ERROR_MESSAGES } from '../constants/payments';

export default function CollectRentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const collectRent = useCollectRent();
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'upi',
    late_fee: '0',
    discount: '0',
    tax: '0',
    transaction_id: '',
    remarks: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    try {
      collectRentSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err: any) {
      const fieldErrors: Record<string, string> = {};
      err.errors?.forEach((e: any) => {
        fieldErrors[e.path[0]] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await collectRent.mutateAsync(formData);
      router.back();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:write']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Collect Rent
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Record a new rent payment
            </Text>
          </View>

          <View style={styles.form}>
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
              label="Payment Method"
              value={formData.payment_method}
              onChangeText={(text) => setFormData({ ...formData, payment_method: text })}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Late Fee (₹)"
              value={formData.late_fee}
              onChangeText={(text) => setFormData({ ...formData, late_fee: text })}
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Discount (₹)"
              value={formData.discount}
              onChangeText={(text) => setFormData({ ...formData, discount: text })}
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Tax (₹)"
              value={formData.tax}
              onChangeText={(text) => setFormData({ ...formData, tax: text })}
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Transaction ID"
              value={formData.transaction_id}
              onChangeText={(text) => setFormData({ ...formData, transaction_id: text })}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Remarks"
              value={formData.remarks}
              onChangeText={(text) => setFormData({ ...formData, remarks: text })}
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={collectRent.isPending}
              disabled={collectRent.isPending}
              style={styles.submitButton}
            >
              Collect Payment
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
