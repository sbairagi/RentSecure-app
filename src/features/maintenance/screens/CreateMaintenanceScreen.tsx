import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRouter } from 'expo-router';
import { validateMaintenance, type MaintenanceFormData } from '../validations';

export default function CreateMaintenanceScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState<MaintenanceFormData>({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    building: 0,
    unit: 0,
    renter: null,
    preferred_date: null,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const result = validateMaintenance(formData);
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
    router.back();
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['maintenance:write']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Title</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="Enter request title"
                placeholderTextColor={theme.textSecondary}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Describe the issue"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Category</Text>
              <Text style={[styles.placeholder, { color: theme.textSecondary }]}>Select from dropdown (backend-dependent)</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Priority</Text>
              <Text style={[styles.placeholder, { color: theme.textSecondary }]}>Select from dropdown (backend-dependent)</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Building</Text>
              <Text style={[styles.placeholder, { color: theme.textSecondary }]}>Select building (backend-dependent)</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Unit</Text>
              <Text style={[styles.placeholder, { color: theme.textSecondary }]}>Select unit (backend-dependent)</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Preferred Date</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                value={formData.preferred_date || ''}
                onChangeText={(text) => setFormData({ ...formData, preferred_date: text || null })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Notes</Text>
              <TextInput
                style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Additional notes"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
            <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.primary }]} onPress={handleSubmit}>
              <Text style={styles.submitText}>Create Request</Text>
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
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  placeholder: {
    fontSize: 14,
    paddingVertical: 8,
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
