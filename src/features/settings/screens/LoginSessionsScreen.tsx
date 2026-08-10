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
import { useLogoutAllDevices } from '../hooks';

export default function LoginSessionsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const logoutAllMutation = useLogoutAllDevices();

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Login Sessions
          </Text>
        </View>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Active Sessions
          </List.Subheader>
          <List.Item
            title="Current Session"
            description="This device"
            left={(props) => <List.Icon {...props} icon="cellphone" />}
            right={(props) => <List.Icon {...props} icon="check-circle" color={theme.colors.primary} />}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Logout from all other devices"
            description={logoutAllMutation.isPending ? 'Processing...' : 'Invalidate all other active sessions'}
            left={(props) => <List.Icon {...props} icon="logout-variant" color={theme.colors.error} />}
            onPress={() => logoutAllMutation.mutate()}
            disabled={logoutAllMutation.isPending}
            style={{ backgroundColor: theme.colors.surface }}
          />
        </List.Section>
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
});
