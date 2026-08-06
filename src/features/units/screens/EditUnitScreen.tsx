import { Spacing } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UNIT_CONSTANTS } from '../constants/unitConstants';
import { useUnit } from '../hooks/useUnit';

export default function EditUnitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { unit, isLoading, error } = useUnit(Number(id));
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    unit: '',
    unit_type: 'flat',
    address_line: '',
    landmark: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
    maintenance_notes: '',
    notes: '',
  });

  React.useEffect(() => {
    if (unit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        unit: unit.unit,
        unit_type: unit.unit_type,
        address_line: unit.address_line,
        landmark: unit.landmark,
        city: unit.city,
        state: unit.state,
        country: unit.country,
        postal_code: unit.postal_code,
        maintenance_notes: unit.maintenance_notes,
        notes: unit.notes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    unit?.id,
    unit?.unit,
    unit?.address_line,
    unit?.city,
    unit?.state,
    unit?.country,
    unit?.postal_code,
    unit?.maintenance_notes,
    unit?.notes,
  ]);

  const handleSubmit = async () => {
    if (!formData.unit.trim() || !formData.address_line.trim() || !formData.city.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const { unitsRepository } = await import('../repository/unitsRepository');
      await unitsRepository.updateUnit(Number(id), {
        ...formData,
        unit_type: formData.unit_type as any,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update unit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error || !unit) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.errorText}>Unit not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Unit</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
          <Text style={[styles.saveButton, { color: loading ? '#9ca3af' : '#4f46e5' }]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: '#fff' }]}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Unit Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.unit}
              onChangeText={(text) => updateField('unit', text)}
              placeholder="Unit number"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Unit Type</Text>
            <View style={styles.typeGrid}>
              {Object.entries(UNIT_CONSTANTS.UNIT_TYPE_LABELS).map(([value, label]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.typeOption,
                    formData.unit_type === value && { backgroundColor: '#4f46e5' },
                  ]}
                  onPress={() => updateField('unit_type', value)}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      { color: formData.unit_type === value ? '#fff' : '#374151' },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: '#fff' }]}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address Line *</Text>
            <TextInput
              style={styles.input}
              value={formData.address_line}
              onChangeText={(text) => updateField('address_line', text)}
              placeholder="Street address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Landmark</Text>
            <TextInput
              style={styles.input}
              value={formData.landmark}
              onChangeText={(text) => updateField('landmark', text)}
              placeholder="Nearby landmark"
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(text) => updateField('city', text)}
                placeholder="City"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(text) => updateField('state', text)}
                placeholder="State"
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Country</Text>
              <TextInput
                style={styles.input}
                value={formData.country}
                onChangeText={(text) => updateField('country', text)}
                placeholder="Country"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput
                style={styles.input}
                value={formData.postal_code}
                onChangeText={(text) => updateField('postal_code', text)}
                placeholder="ZIP / Postal code"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: '#fff' }]}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Maintenance Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.maintenance_notes}
              onChangeText={(text) => updateField('maintenance_notes', text)}
              placeholder="Internal notes about maintenance"
              multiline
              numberOfLines={3}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => updateField('notes', text)}
              placeholder="Additional notes"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  section: {
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
