import { Spacing } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Renter {
  id: number;
  name: string;
  phone: string;
  status: string;
}

export default function AssignRenterScreen() {
  const router = useRouter();
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const [search, setSearch] = useState('');
  const [selectedRenter, setSelectedRenter] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  const mockRenters: Renter[] = [
    { id: 1, name: 'John Doe', phone: '+1 234 567 8900', status: 'active' },
    { id: 2, name: 'Jane Smith', phone: '+1 234 567 8901', status: 'active' },
    { id: 3, name: 'Bob Johnson', phone: '+1 234 567 8902', status: 'notice_period' },
  ];

  const filteredRenters = mockRenters.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search)
  );

  const handleAssign = async () => {
    if (!selectedRenter) return;
    setAssigning(true);
    try {
      const { unitsRepository } = await import('../repository/unitsRepository');
      await unitsRepository.assignRenter(Number(unitId), selectedRenter);
      router.back();
    } catch {
      // Error handled
    } finally {
      setAssigning(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Renter</Text>
        <TouchableOpacity onPress={handleAssign} disabled={!selectedRenter || assigning}>
          <Text
            style={[
              styles.saveButton,
              { color: selectedRenter && !assigning ? '#4f46e5' : '#9ca3af' },
            ]}
          >
            {assigning ? 'Assigning...' : 'Assign'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.searchContainer, { backgroundColor: '#fff' }]}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search renters..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.rentersList}>
          {filteredRenters.map((renter) => (
            <TouchableOpacity
              key={renter.id}
              style={[
                styles.renterItem,
                {
                  backgroundColor: '#fff',
                  borderColor: selectedRenter === renter.id ? '#4f46e5' : '#f3f4f6',
                },
              ]}
              onPress={() => setSelectedRenter(renter.id)}
            >
              <View style={styles.renterInfo}>
                <Text style={styles.renterName}>{renter.name}</Text>
                <Text style={styles.renterPhone}>{renter.phone}</Text>
              </View>
              <Text
                style={[
                  styles.renterStatus,
                  { color: renter.status === 'active' ? '#16a34a' : '#d97706' },
                ]}
              >
                {renter.status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

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
  searchContainer: {
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    fontSize: 15,
    color: '#111827',
  },
  rentersList: {
    gap: Spacing.sm,
  },
  renterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
  },
  renterInfo: {
    flex: 1,
  },
  renterName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  renterPhone: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  renterStatus: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
