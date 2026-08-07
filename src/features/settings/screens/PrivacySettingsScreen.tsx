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

export default function PrivacySettingsScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Privacy Settings
          </Text>
        </View>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Data & Privacy
          </List.Subheader>
          <List.Item
            title="Data Export"
            description="Download your data (coming soon)"
            left={(props) => <List.Icon {...props} icon="download" />}
            disabled
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Privacy Preferences"
            description="Manage privacy settings"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            onPress={() => {}}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Account Activity"
            description="View recent account activity"
            left={(props) => <List.Icon {...props} icon="history" />}
            onPress={() => router.push('/(drawer)/(tabs)/settings/login-sessions')}
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
