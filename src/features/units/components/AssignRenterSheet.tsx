import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUnitSubscriptionLimits } from '../hooks/useUnitSubscriptionLimits';

interface AssignRenterSheetProps {
  visible: boolean;
  unitId: number;
  onClose: () => void;
  onAssign: (renterId: number) => void;
}

export const AssignRenterSheet: React.FC<AssignRenterSheetProps> = ({
  visible,
  unitId,
  onClose,
  onAssign,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { limits } = useUnitSubscriptionLimits();

  const maxRenters = limits?.max_units ?? 'unlimited';

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Assign Renter</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={[styles.description, { color: theme.subText }]}>
            Select a renter to assign to this unit.
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => {
              onClose();
              router.push(`/(drawer)/(tabs)/renters?unitId=${unitId}`);
            }}
          >
            <Text style={styles.buttonText}>Select Renter</Text>
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
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
