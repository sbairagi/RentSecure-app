import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams } from 'expo-router';
import { validateMaintenanceStatus, type MaintenanceStatusFormData } from '../validations';

export default function UpdateStatusScreen() {
  const theme = useTheme();
  const _params = useLocalSearchParams<{ id: string }>();
  const [formData, setFormData] = useState<MaintenanceStatusFormData>({
    status: 'in_progress',
    resolution_notes: '',
  });
  const [_errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const result = validateMaintenanceStatus(formData);
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
              <Text style={[styles.label, { color: theme.text }]}>Status</Text>
              <Text style={[styles.placeholder, { color: theme.textSecondary }]}>Select status (backend-dependent)</Text>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Resolution Notes</Text>
              <TextInput
                style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
                value={formData.resolution_notes}
                onChangeText={(text) => setFormData({ ...formData, resolution_notes: text })}
                placeholder="Add resolution notes"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>
            <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.primary }]} onPress={handleSubmit}>
              <Text style={styles.submitText}>Update Status</Text>
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
