import { RouteGuard } from '@/navigation/components/RouteGuard';
import { mapBackendRole, type UserRole } from '@/navigation/types/navigation.types';
import { canAccessFeature } from '@/navigation/utils/roleRedirect';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import GlobalSearchScreen from '@/features/search/screens/GlobalSearchScreen';

export default function SearchScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const role = mapBackendRole(user?.role);

  if (!canAccessFeature(role, 'search')) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Search is not available for your role.</Text>
      </View>
    );
  }

  return <GlobalSearchScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
  },
});
