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

export default function HelpSupportScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Help & Support
          </Text>
        </View>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Support
          </List.Subheader>
          <List.Item
            title="FAQ"
            description="Frequently asked questions"
            left={(props) => <List.Icon {...props} icon="frequently-asked-questions" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(drawer)/(tabs)/support')}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Contact Support"
            description="Get in touch with our support team"
            left={(props) => <List.Icon {...props} icon="email-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(drawer)/(tabs)/support')}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Support Tickets"
            description="View and manage your tickets"
            left={(props) => <List.Icon {...props} icon="ticket-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(drawer)/(tabs)/support/tickets')}
            style={{ backgroundColor: theme.colors.surface }}
          />
        </List.Section>

        <List.Section>
          <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
            Legal
          </List.Subheader>
          <List.Item
            title="Terms of Service"
            description="View our terms"
            left={(props) => <List.Icon {...props} icon="file-document-outline" />}
            right={(props) => <List.Icon {...props} icon="open-in-new" />}
            onPress={() => {}}
            style={{ backgroundColor: theme.colors.surface }}
          />
          <List.Item
            title="Privacy Policy"
            description="View our privacy policy"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            right={(props) => <List.Icon {...props} icon="open-in-new" />}
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
});
