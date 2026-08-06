import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import type { KYCUploadDialogProps } from '../types';

const DOCUMENT_TYPES = [
  { label: 'Aadhar Card', value: 'aadhar' },
  { label: 'PAN Card', value: 'pan' },
  { label: 'Passport', value: 'passport' },
  { label: 'Driving License', value: 'driving_license' },
  { label: 'Voter ID', value: 'voter_id' },
  { label: 'Other', value: 'other' },
];

export const KYCUploadDialog: React.FC<KYCUploadDialogProps> = ({ visible, onClose, onSubmit }) => {
  const theme = useTheme();
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [file, setFile] = useState('');

  const handleSubmit = () => {
    onSubmit({
      document_type: documentType,
      document_number: documentNumber,
      file,
    });
    setDocumentType('');
    setDocumentNumber('');
    setFile('');
    onClose();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose} style={{ backgroundColor: theme.card }}>
        <Dialog.Title style={{ color: theme.text }}>Upload KYC Document</Dialog.Title>
        <Dialog.Content>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.text }]}>Document Type</Text>
              <View style={[styles.pickerContainer, { borderColor: theme.border }]}>
                <Text
                  style={[styles.pickerText, { color: documentType ? theme.text : theme.subText }]}
                >
                  {DOCUMENT_TYPES.find((d) => d.value === documentType)?.label ||
                    'Select document type'}
                </Text>
              </View>
            </View>
            <TextInput
              mode="outlined"
              label="Document Number"
              value={documentNumber}
              onChangeText={setDocumentNumber}
              style={styles.input}
              accessible
              accessibilityRole="text"
              accessibilityLabel="Document number"
            />
            <TextInput
              mode="outlined"
              label="File URL"
              value={file}
              onChangeText={setFile}
              style={styles.input}
              accessible
              accessibilityRole="text"
              accessibilityLabel="File URL"
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose} textColor={theme.subText}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} textColor={theme.primary}>
            Submit
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: Spacing.md,
  },
  field: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 14,
  },
  input: {
    backgroundColor: 'transparent',
  },
});
