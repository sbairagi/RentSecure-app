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
          isPhoneVerified={false}
        />
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
