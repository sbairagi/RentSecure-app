import { Spacing } from '@/constants/theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';

export default function AddRenterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Implement create renter via rentersApi or useCreateRenter mutation
      router.back();
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Add Renter</Title>
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
        />
        <TextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
        />
        <TextInput
          label="Rent Amount"
          value={rentAmount}
          onChangeText={setRentAmount}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
        />
        <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading}>
          Add Renter
        </Button>
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  input: {
    marginBottom: Spacing.sm,
  },
});
