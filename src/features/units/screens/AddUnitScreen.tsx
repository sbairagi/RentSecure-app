import { Spacing } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UNIT_CONSTANTS } from '../constants/unitConstants';
import { useUnitSubscriptionLimits } from '../hooks/useUnitSubscriptionLimits';

export default function AddUnitScreen() {
  const router = useRouter();
  const { building: buildingParam, buildingName: buildingNameParam } = useLocalSearchParams<{
    building?: string;
    buildingName?: string;
  }>();
  const { limits } = useUnitSubscriptionLimits();
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
    latitude: '',
    longitude: '',
    maintenance_notes: '',
    notes: '',
    rent_due_reminder: true,
    agreement_expiry_reminder: true,
  });

  const canCreate = limits?.can_create_unit ?? true;

  useEffect(() => {
    if (buildingParam) {
      const parsed = parseInt(buildingParam, 10);
      if (!Number.isNaN(parsed)) {
        setFormData((prev) => ({ ...prev }));
      }
    }
  }, [buildingParam]);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.unit.trim() || !formData.address_line.trim() || !formData.city.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const buildingId = buildingParam ? parseInt(buildingParam as string, 10) : null;

    setLoading(true);
    try {
      const { unitsRepository } = await import('../repository/unitsRepository');
      await unitsRepository.createUnit({
        unit: formData.unit,
        unit_type: formData.unit_type as any,
        address_line: formData.address_line,
        landmark: formData.landmark || undefined,
        city: formData.city,
        state: formData.state || undefined,
        country: formData.country,
        postal_code: formData.postal_code,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        maintenance_notes: formData.maintenance_notes || undefined,
        notes: formData.notes || undefined,
        rent_due_reminder: formData.rent_due_reminder,
        agreement_expiry_reminder: formData.agreement_expiry_reminder,
        building: buildingId,
        building_name: buildingNameParam ? String(buildingNameParam) : undefined,
      });
      router.back();
    } catch (_error) {
      Alert.alert('Error', 'Failed to create unit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!canCreate) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <View style={styles.limitReached}>
          <Text style={styles.limitIcon}>⚠️</Text>
          <Text style={styles.limitTitle}>Unit Limit Reached</Text>
          <Text style={styles.limitDescription}>
            You have reached your plan limit. Please upgrade to add more units.
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => router.push('/(drawer)/(tabs)/subscription')}
          >
            <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Unit</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
          <Text style={[styles.saveButton, { color: loading ? '#9ca3af' : '#4f46e5' }]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {buildingParam && (
          <View style={[styles.section, { backgroundColor: '#fff' }]}>
            <Text style={styles.sectionTitle}>Building</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.valueText}>
                {buildingNameParam ? String(buildingNameParam) : `Building #${buildingParam}`}
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: '#fff' }]}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Unit Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.unit}
              onChangeText={(text) => updateField('unit', text)}
              placeholder="e.g., 101, Flat A"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Unit Type *</Text>
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
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.input}
                value={formData.latitude}
                onChangeText={(text) => updateField('latitude', text)}
                placeholder="e.g., 19.0760"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.input}
                value={formData.longitude}
                onChangeText={(text) => updateField('longitude', text)}
                placeholder="e.g., 72.8777"
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
  limitReached: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  limitIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  limitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  limitDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  upgradeButton: {
    backgroundColor: '#d97706',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 15,
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
  valueText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
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
