import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

export default function RenterDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <RouteGuard requireAuth requireRole={['renter']}>
      <PermissionGuard permissions={['dashboard:read']}>
        <View style={styles.container}>
          <Text style={styles.title}>Renter Dashboard</Text>
          <Text style={styles.subtitle}>Your rent payments, agreements, and notifications</Text>
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/(drawer)/(tabs)/search')}
            accessibilityLabel="Open search"
            accessibilityRole="button"
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
