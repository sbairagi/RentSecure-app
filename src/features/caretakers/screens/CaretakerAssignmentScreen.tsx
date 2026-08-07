import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCaretaker } from '../hooks';

export default function CaretakerAssignmentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { caretaker } = useCaretaker(Number(id));

  if (!caretaker) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['caretaker:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text }}>Loading...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['caretaker:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Assignment Details</Text>
            <Text style={[styles.description, { color: theme.subText }]}>
              This caretaker is assigned to unit <Text style={{ fontWeight: '600' }}>{caretaker.unit}</Text>.
            </Text>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.subText }]}>Assigned Unit</Text>
              <Text style={[styles.value, { color: theme.text }]}>{caretaker.unit}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.subText }]}>Status</Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {caretaker.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.subText }]}>Joining Date</Text>
              <Text style={[styles.value, { color: theme.text }]}>{caretaker.joining_date}</Text>
            </View>
            {caretaker.leaving_date ? (
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.subText }]}>Leaving Date</Text>
                <Text style={[styles.value, { color: theme.text }]}>{caretaker.leaving_date}</Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Reassign Caretaker</Text>
            <Text style={[styles.description, { color: theme.subText }]}>
              To reassign this caretaker to a different unit, edit the caretaker details.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => router.push(`/(drawer)/(tabs)/caretakers/${caretaker.id}/edit`)}
            >
              <Text style={styles.buttonText}>Edit Assignment</Text>
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
    padding: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.md,
    borderRadius: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
