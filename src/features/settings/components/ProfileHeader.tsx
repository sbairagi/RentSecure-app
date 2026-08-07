import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isPhoneVerified?: boolean;
}

export function ProfileHeader({
  fullName,
  email,
  phone,
  role,
  isPhoneVerified = false,
}: ProfileHeaderProps) {
  const theme = useTheme();
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.avatarContainer}>
        <Avatar.Text
          size={80}
          label={initials}
          style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}
          color={theme.colors.onPrimaryContainer}
        />
      </View>
      <Text style={[styles.name, { color: theme.colors.onPrimary }]}>{fullName}</Text>
      <Text style={[styles.email, { color: theme.colors.onPrimary }]}>{email}</Text>
      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: theme.colors.onPrimary }]}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Text>
        <Text style={[styles.metaText, { color: theme.colors.onPrimary }]}>•</Text>
        <Text style={[styles.metaText, { color: theme.colors.onPrimary }]}>
          {isPhoneVerified ? '✓ Verified' : 'Unverified'}
        </Text>
      </View>
      {phone ? (
        <Text style={[styles.phone, { color: theme.colors.onPrimary }]}>{phone}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    elevation: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    opacity: 0.9,
  },
  phone: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
});
