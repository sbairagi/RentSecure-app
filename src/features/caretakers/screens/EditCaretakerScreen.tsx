import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCaretaker } from '../hooks';
import { validateCaretaker } from '../validations';
import type { CaretakerFormData } from '../validations';

export default function EditCaretakerScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { caretaker, updateCaretaker, isUpdating } = useCaretaker(Number(id));
  const [form, setForm] = useState<CaretakerFormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const prevCaretakerIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (caretaker && caretaker.id !== prevCaretakerIdRef.current) {
      prevCaretakerIdRef.current = caretaker.id;
      setForm({
        unit: caretaker.unit,
        name: caretaker.name,
        phone: caretaker.phone,
        email: caretaker.email,
        alternate_phone: caretaker.alternate_phone,
        address: caretaker.address,
        joining_date: caretaker.joining_date,
        notes: caretaker.notes,
        is_active: caretaker.is_active,
        leaving_date: caretaker.leaving_date || '',
      });
    }
  }, [caretaker]);

  const handleSubmit = async () => {
    if (!form) return;
    const result = validateCaretaker(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await updateCaretaker({ id: Number(id), payload: result.data });
    router.back();
  };

  const updateField = <K extends keyof CaretakerFormData>(field: K, value: CaretakerFormData[K]) => {
    if (!form) return;
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (!form) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['caretaker:write']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>Loading...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:write']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View
            style={[
              styles.header,
              { backgroundColor: theme.card, borderBottomColor: theme.border },
            ]}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.backButton, { color: theme.subText }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Caretaker</Text>
            <TouchableOpacity onPress={handleSubmit} disabled={isUpdating}>
              <Text
                style={[
                  styles.saveButton,
                  { color: isUpdating ? theme.subText : theme.primary },
                ]}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={[styles.formCard, { backgroundColor: theme.card }]}>
              <FormField
                label="Name *"
                value={form.name}
                onChangeText={(text) => updateField('name', text)}
                placeholder="Caretaker name"
                error={errors.name}
                theme={theme}
              />
              <FormField
                label="Phone *"
                value={form.phone}
                onChangeText={(text) => updateField('phone', text)}
                placeholder="+91XXXXXXXXXX"
                keyboardType="phone-pad"
                error={errors.phone}
                theme={theme}
              />
              <FormField
                label="Email"
                value={form.email}
                onChangeText={(text) => updateField('email', text)}
                placeholder="email@example.com"
                keyboardType="email-address"
                error={errors.email}
                theme={theme}
              />
              <FormField
                label="Alternate Phone"
                value={form.alternate_phone}
                onChangeText={(text) => updateField('alternate_phone', text)}
                placeholder="+91XXXXXXXXXX"
                keyboardType="phone-pad"
                error={errors.alternate_phone}
                theme={theme}
              />
              <FormField
                label="Address"
                value={form.address}
                onChangeText={(text) => updateField('address', text)}
                placeholder="Address"
                multiline
                error={errors.address}
                theme={theme}
              />
              <FormField
                label="Joining Date *"
                value={form.joining_date}
                onChangeText={(text) => updateField('joining_date', text)}
                placeholder="YYYY-MM-DD"
                error={errors.joining_date}
                theme={theme}
              />
              <FormField
                label="Notes"
                value={form.notes}
                onChangeText={(text) => updateField('notes', text)}
                placeholder="Additional notes"
                multiline
                error={errors.notes}
                theme={theme}
              />
            </View>
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

interface FormFieldProps {
  label: string;
  value: string | undefined;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  theme: ReturnType<typeof useTheme>;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  multiline?: boolean;
}

  const FormField: React.FC<FormFieldProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    theme,
    keyboardType = 'default',
    multiline = false,
  }) => (
    <View style={styles.formField}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
            borderColor: error ? theme.danger : theme.border,
            backgroundColor: theme.background,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.subText}
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {error ? <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  formCard: {
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  formField: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 2,
  },
});
