import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AssignCaretakerSheetProps {
  visible: boolean;
  unitId: number;
  onClose: () => void;
  onAssign: (data: { name: string; phone: string; email?: string }) => void;
}

export const AssignCaretakerSheet: React.FC<AssignCaretakerSheetProps> = ({
  visible,
  unitId,
  onClose,
  onAssign,
}) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    onAssign({ name: name.trim(), phone: phone.trim(), email: email.trim() || undefined });
    setName('');
    setPhone('');
    setEmail('');
  };

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Assign Caretaker</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Name</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              value={name}
              onChangeText={setName}
              placeholder="Caretaker name"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Phone</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Email (Optional)</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
            />
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Assign Caretaker</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    width: '100%',
    borderRadius: 16,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 20,
    color: '#9ca3af',
  },
  content: {
    gap: Spacing.md,
  },
  inputContainer: {
    gap: Spacing.xs,
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
  button: {
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
