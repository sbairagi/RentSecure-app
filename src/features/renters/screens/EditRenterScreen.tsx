import { Spacing } from '@/constants/theme';
import { useRenter } from '@/features/renters/hooks/useRenter';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';

export default function EditRenterScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { renter, isLoading } = useRenter(Number(id));
  const [loading, setLoading] = React.useState(false);

  const name = renter?.name || '';
  const email = renter?.email || '';
  const phone = renter?.phone || '';

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Implement update renter via rentersApi or useUpdateRenter mutation
      router.back();
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <Text>Loading...</Text>
        </View>
      </RouteGuard>
    );
  }

  if (!renter) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
          <Text style={styles.errorText}>Renter not found</Text>
        </View>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Title style={styles.title}>Edit Renter</Title>
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={() => {}}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={() => {}}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
        />
        <TextInput
          label="Phone"
          value={phone}
          onChangeText={() => {}}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
        />
        <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading}>
          Save Changes
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
  errorText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    color: '#dc2626',
  },
  input: {
    marginBottom: Spacing.sm,
  },
});
