import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCaretaker } from '../hooks';

export default function CaretakerDetailsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { caretaker, isLoading, error } = useCaretaker(Number(id));

  if (isLoading) {
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

  if (error || !caretaker) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['caretaker:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.errorText, { color: theme.text }]}>
              {error || 'Caretaker not found'}
            </Text>
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
            <View style={styles.header}>
              <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.avatarText, { color: theme.primary }]}>
                  {caretaker.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={[styles.name, { color: theme.text }]}>{caretaker.name}</Text>
                <Text style={[styles.phone, { color: theme.subText }]}>{caretaker.phone}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: caretaker.is_active
                      ? '#D1FAE5'
                      : '#FEE2E2',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: caretaker.is_active
                        ? theme.success
                        : theme.danger,
                    },
                  ]}
                >
                  {caretaker.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>
            <DetailRow label="Email" value={caretaker.email || 'N/A'} theme={theme} />
            <DetailRow label="Phone" value={caretaker.phone} theme={theme} />
            <DetailRow label="Alternate Phone" value={caretaker.alternate_phone || 'N/A'} theme={theme} />
            <DetailRow label="Address" value={caretaker.address || 'N/A'} theme={theme} />
          </View>

          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Assignment Details</Text>
            <DetailRow label="Unit ID" value={String(caretaker.unit)} theme={theme} />
            <DetailRow label="Joining Date" value={caretaker.joining_date} theme={theme} />
            <DetailRow
              label="Leaving Date"
              value={caretaker.leaving_date || 'N/A'}
              theme={theme}
            />
            <DetailRow
              label="Status"
              value={caretaker.is_active ? 'Active' : 'Inactive'}
              theme={theme}
            />
          </View>

          {caretaker.notes ? (
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes</Text>
              <Text style={[styles.notesText, { color: theme.subText }]}>{caretaker.notes}</Text>
            </View>
          ) : null}
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const DetailRow = ({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, { color: theme.subText }]}>{label}</Text>
    <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  phone: {
    fontSize: 14,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});
