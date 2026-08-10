import { Spacing } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRenters } from '@/features/renters/hooks/useRenters';
import type { Renter } from '@/features/renters/types/renters';

export default function AssignRenterScreen() {
  const router = useRouter();
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const { renters, isLoading } = useRenters();
  const [search, setSearch] = useState('');
  const [selectedRenterId, setSelectedRenterId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  const availableRenters = (renters || []).filter((renter) =>
    renter.name.toLowerCase().includes(search.toLowerCase()) ||
    renter.phone.includes(search)
  );

  const handleAssign = async () => {
    if (!selectedRenterId || !unitId) return;
    setAssigning(true);
    try {
      const { unitsRepository } = await import('../repository/unitsRepository');
      await unitsRepository.assignRenter(Number(unitId), selectedRenterId);
      router.back();
    } catch (_error) {
      Alert.alert('Error', 'Failed to assign renter. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.loadingText}>Loading renters...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Renter</Text>
        <TouchableOpacity
          onPress={handleAssign}
          disabled={!selectedRenterId || assigning}
        >
          <Text
            style={[
              styles.saveButton,
              { color: selectedRenterId && !assigning ? '#4f46e5' : '#9ca3af' },
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
          {availableRenters.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>No renters found</Text>
              <Text style={styles.emptyDescription}>
                {search ? 'Try a different search term.' : 'Add renters first to assign them.'}
              </Text>
            </View>
          ) : (
            availableRenters.map((renter) => (
              <TouchableOpacity
                key={renter.id}
                style={[
                  styles.renterItem,
                  {
                    backgroundColor: '#fff',
                    borderColor: selectedRenterId === renter.id ? '#4f46e5' : '#f3f4f6',
                  },
                ]}
                onPress={() => setSelectedRenterId(renter.id)}
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
                  {renter.status.replace(/_/g, ' ')}
                </Text>
              </TouchableOpacity>
            ))
          )}
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
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
