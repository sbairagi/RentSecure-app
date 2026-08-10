import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export function EmptyRenterDashboard() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🏠</Text>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginTop: 16 }}>
        No Dashboard Data
      </Text>
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}
      >
        We couldn&apos;t load your renter dashboard. You may not be assigned to a unit yet.
      </Text>
      <Button
        mode="contained"
        onPress={() => router.push('/(drawer)/(tabs)/search')}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
      >
        Browse Properties
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
  },
});