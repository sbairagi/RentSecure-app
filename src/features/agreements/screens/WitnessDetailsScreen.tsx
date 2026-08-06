import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WitnessCard } from '../components/WitnessCard';
import { useAgreement } from '../hooks/useAgreement';
import { useAgreementSignatures } from '../hooks/useAgreementSignatures';

export default function WitnessDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agreement, isLoading } = useAgreement(Number(id));
  const { signatures, refetch } = useAgreementSignatures(Number(id));
  const [witnessName, setWitnessName] = useState('');
  const [witnessPhone, setWitnessPhone] = useState('');
  const [witnessAddress, setWitnessAddress] = useState('');
  const theme = useTheme();

  const handleAddWitness = async () => {
    if (!witnessName || !witnessPhone) return;
    await refetch();
    setWitnessName('');
    setWitnessPhone('');
    setWitnessAddress('');
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Witnesses</Text>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Add Witness</Text>
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827' }]}
            placeholder="Name"
            placeholderTextColor="#9ca3af"
            value={witnessName}
            onChangeText={setWitnessName}
            accessible
            accessibilityLabel="Witness name"
          />
          <TextInput
            style={[styles.input, { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827' }]}
            placeholder="Phone"
            placeholderTextColor="#9ca3af"
            value={witnessPhone}
            onChangeText={setWitnessPhone}
            accessible
            accessibilityLabel="Witness phone"
          />
          <TextInput
            style={[styles.input, { backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827' }]}
            placeholder="Address"
            placeholderTextColor="#9ca3af"
            value={witnessAddress}
            onChangeText={setWitnessAddress}
            accessible
            accessibilityLabel="Witness address"
          />
          <TouchableOpacity
            onPress={handleAddWitness}
            style={styles.addButton}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Add witness"
          >
            <Text style={styles.addButtonText}>Add Witness</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Existing Witnesses</Text>
        {signatures.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.subText }]}>No witnesses added yet.</Text>
        ) : (
          signatures.map((witness) => (
            <WitnessCard key={witness.id} witness={witness} />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  section: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  form: {
    gap: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
});
