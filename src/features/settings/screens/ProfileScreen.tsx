import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Text,
  useTheme,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import { ProfileHeader } from '../components';
import { useProfile } from '../hooks';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
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
      <View testID="profile.screen" style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ProfileHeader
          fullName={profile.full_name}
          email={profile.email}
          phone={profile.phone}
          role={profile.role}
          isPhoneVerified={profile.is_phone_verified}
        />

        <View style={styles.actionsRow}>
          <Button
            testID="profile.edit"
            mode="contained"
            onPress={() => router.push('/(drawer)/(tabs)/settings/edit-profile')}
            icon="pencil"
          >
            Edit Profile
          </Button>
          <Button
            testID="profile.logout"
            mode="outlined"
            onPress={() => {/* logout logic */}}
            icon="logout"
            style={{ marginTop: 8 }}
          >
            Logout
          </Button>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Account Information
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <InfoRow label="User ID" value={String(profile.id)} theme={theme} />
            <InfoRow label="Username" value={profile.username || '-'} theme={theme} />
            <InfoRow label="Full Name" value={profile.full_name || '-'} theme={theme} />
            <InfoRow label="Email" value={profile.email} theme={theme} />
            <InfoRow label="Phone" value={profile.phone || '-'} theme={theme} />
            <InfoRow label="Role" value={profile.role || '-'} theme={theme} />
            <InfoRow
              label="Phone Verified"
              value={profile.is_phone_verified ? 'Yes' : 'No'}
              theme={theme}
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Permissions
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            {(profile.permissions || []).length === 0 ? (
              <InfoRow label="Permissions" value="None" theme={theme} />
            ) : (
              profile.permissions!.map((perm) => (
                <View
                  key={perm}
                  style={[styles.permissionRow, { borderBottomColor: theme.colors.outline }]}
                >
                  <Text style={[styles.permissionText, { color: theme.colors.onSurface }]}>
                    {perm}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </RouteGuard>
  );
}

function InfoRow({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: theme.colors.outline }]}>
      <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionsRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
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
  permissionRow: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  permissionText: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
});
