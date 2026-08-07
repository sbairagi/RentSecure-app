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
import { environment } from '@/config/environment';

export default function AboutScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            About
          </Text>
        </View>

        <View style={[styles.logoContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.appName, { color: theme.colors.onSurface }]}>
            RentSecure
          </Text>
          <Text style={[styles.version, { color: theme.colors.onSurfaceVariant }]}>
            Version {environment.appVersion}
          </Text>
          <Text style={[styles.environment, { color: theme.colors.onSurfaceVariant }]}>
            {environment.appEnv}
          </Text>
        </View>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            App Information
          </List.Subheader>
          <List.Item
            title="App Name"
            description={environment.appName}
            left={(props) => <List.Icon {...props} icon="application" />}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Version"
            description={environment.appVersion}
            left={(props) => <List.Icon {...props} icon="tag" />}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Environment"
            description={environment.appEnv}
            left={(props) => <List.Icon {...props} icon="debug" />}
            style={{ backgroundColor: theme.colors.surface }}
          />
        </List.Section>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Legal
          </List.Subheader>
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Open Source Licenses"
            left={(props) => <List.Icon {...props} icon="open-source-initiative" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
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
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
  },
  version: {
    fontSize: 14,
    marginTop: 4,
  },
  environment: {
    fontSize: 12,
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
