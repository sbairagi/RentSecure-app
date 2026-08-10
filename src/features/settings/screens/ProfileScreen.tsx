import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { ProfileHeader } from '../components';
import { useProfile } from '../hooks';

export default function ProfileScreen() {
  const theme = useTheme();
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.error }}>
          Failed to load profile
        </Text>
      </View>
    );
  }

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ProfileHeader
          fullName={profile.full_name}
          email={profile.email}
          phone={profile.phone}
          role={profile.role}
          isPhoneVerified={profile.is_phone_verified}
        />
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Account Information
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <InfoRow label="User ID" value={profile.id} theme={theme} />
            <InfoRow label="Username" value={profile.username || '-'} theme={theme} />
            <InfoRow label="Email" value={profile.email} theme={theme} />
            <InfoRow label="Phone" value={profile.phone || '-'} theme={theme} />
            <InfoRow label="Role" value={profile.role} theme={theme} />
            <InfoRow
              label="Phone Verified"
              value={profile.is_phone_verified ? 'Yes' : 'No'}
              theme={theme}
            />
          </View>
        </View>
      </View>
    </RouteGuard>
  );
}

function InfoRow({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
