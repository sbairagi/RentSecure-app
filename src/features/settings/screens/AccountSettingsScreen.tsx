import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  IconButton,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import { useProfile } from '../hooks';

export default function AccountSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: _profile } = useProfile();

  const menuItems = [
    {
      id: 'edit_profile',
      title: 'Edit Profile',
      description: 'Update your personal information',
      icon: 'account-edit',
      href: '/(drawer)/(tabs)/settings/edit-profile',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Password, biometric, sessions',
      icon: 'shield-lock',
      href: '/(drawer)/(tabs)/settings/security',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification preferences',
      icon: 'bell-outline',
      href: '/(drawer)/(tabs)/settings/notifications',
    },
    {
      id: 'subscription',
      title: 'Subscription',
      description: 'Manage your subscription',
      icon: 'credit-card-outline',
      href: '/(drawer)/(tabs)/subscription',
    },
    {
      id: 'devices',
      title: 'Connected Devices',
      description: 'Manage your devices',
      icon: 'devices',
      href: '/(drawer)/(tabs)/settings/devices',
    },
    {
      id: 'sessions',
      title: 'Login Sessions',
      description: 'Active sessions',
      icon: 'login',
      href: '/(drawer)/(tabs)/settings/login-sessions',
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Data and privacy settings',
      icon: 'shield-account',
      href: '/(drawer)/(tabs)/settings/privacy',
    },
    {
      id: 'language',
      title: 'Language',
      description: 'Change app language',
      icon: 'translate',
      href: '/(drawer)/(tabs)/settings/language',
    },
    {
      id: 'theme',
      title: 'Theme',
      description: 'Light, dark, or system',
      icon: 'brightness-auto',
      href: '/(drawer)/(tabs)/settings/theme',
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: 'help-circle-outline',
      href: '/(drawer)/(tabs)/settings/help',
    },
    {
      id: 'about',
      title: 'About',
      description: 'App information',
      icon: 'information-outline',
      href: '/(drawer)/(tabs)/settings/about',
    },
    {
      id: 'delete',
      title: 'Delete Account',
      description: 'Permanently delete your account',
      icon: 'delete-forever-outline',
      href: '/(drawer)/(tabs)/settings/delete-account',
      danger: true,
    },
  ];

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Account Settings
          </Text>
        </View>

        {menuItems.map((item) => (
          <List.Item
            key={item.id}
            title={item.title}
            description={item.description}
            left={(props) => (
              <List.Icon
                {...props}
                icon={item.icon as any}
                color={item.danger ? theme.colors.error : undefined}
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push(item.href as any)}
            titleStyle={item.danger ? { color: theme.colors.error } : undefined}
            style={[
              styles.item,
              { backgroundColor: theme.colors.surface },
              item.danger && { borderLeftWidth: 3, borderLeftColor: theme.colors.error },
            ]}
          />
        ))}
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  item: {
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 8,
  },
});
