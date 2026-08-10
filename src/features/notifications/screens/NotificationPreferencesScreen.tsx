import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Switch, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useNotificationPreferences, useUpdatePreferences } from '../hooks';
import { PreferenceSection } from '../components/PreferenceSection';
import type { NotificationPreferences } from '../types';

export default function NotificationPreferencesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { preferences, isLoading, error } = useNotificationPreferences();
  const { mutate: updatePreferences, isPending } = useUpdatePreferences();

  const handleToggle = useCallback(
    (key: keyof NotificationPreferences) => {
      if (!preferences) return;
      const updated = { ...preferences, [key]: !preferences[key] };
      updatePreferences(updated);
    },
    [preferences, updatePreferences]
  );

  const handleSave = useCallback(() => {
    if (preferences) {
      updatePreferences(preferences);
    }
  }, [preferences, updatePreferences]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
          Loading preferences...
        </Text>
      </View>
    );
  }

  if (error || !preferences) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.error }}>
          Failed to load preferences
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Notification Preferences
        </Text>
        <IconButton
          icon="check"
          size={24}
          onPress={handleSave}
          disabled={isPending}
          iconColor={theme.colors.primary}
        />
      </View>

      <PreferenceSection
        title="Push Notifications"
        description="Master control for push notifications"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Enable Push Notifications
          </Text>
          <Switch
            value={!!preferences.push_enabled}
            onValueChange={() => handleToggle('push_enabled')}
          />
        </View>
      </PreferenceSection>

      <PreferenceSection
        title="Rent Alerts"
        description="Receive notifications about rent payments and reminders"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Push
          </Text>
          <Switch
            value={!!preferences.rent_alerts_push}
            onValueChange={() => handleToggle('rent_alerts_push')}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            WhatsApp
          </Text>
          <Switch
            value={!!preferences.rent_alerts_whatsapp}
            onValueChange={() => handleToggle('rent_alerts_whatsapp')}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Email
          </Text>
          <Switch
            value={!!preferences.rent_alerts_email}
            onValueChange={() => handleToggle('rent_alerts_email')}
          />
        </View>
      </PreferenceSection>

      <PreferenceSection
        title="Monthly Summary"
        description="Receive monthly rent summary reports"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Email
          </Text>
          <Switch
            value={!!preferences.monthly_summary_email}
            onValueChange={() => handleToggle('monthly_summary_email')}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            WhatsApp
          </Text>
          <Switch
            value={!!preferences.monthly_summary_whatsapp}
            onValueChange={() => handleToggle('monthly_summary_whatsapp')}
          />
        </View>
      </PreferenceSection>

      <PreferenceSection
        title="Payout Alerts"
        description="Receive notifications about rent payout status"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            WhatsApp
          </Text>
          <Switch
            value={!!preferences.payout_alerts_whatsapp}
            onValueChange={() => handleToggle('payout_alerts_whatsapp')}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Email
          </Text>
          <Switch
            value={!!preferences.payout_alerts_email}
            onValueChange={() => handleToggle('payout_alerts_email')}
          />
        </View>
      </PreferenceSection>

      <PreferenceSection
        title="Maintenance Alerts"
        description="Receive push notifications for maintenance updates"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Push
          </Text>
          <Switch
            value={!!preferences.maintenance_push}
            onValueChange={() => handleToggle('maintenance_push')}
          />
        </View>
      </PreferenceSection>

      <PreferenceSection
        title="Visitor Alerts"
        description="Receive push notifications for visitor requests"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Push
          </Text>
          <Switch
            value={!!preferences.visitor_push}
            onValueChange={() => handleToggle('visitor_push')}
          />
        </View>
      </PreferenceSection>

      <PreferenceSection
        title="Agreement Alerts"
        description="Receive push notifications for agreement updates"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Push
          </Text>
          <Switch
            value={!!preferences.agreement_push}
            onValueChange={() => handleToggle('agreement_push')}
          />
        </View>
      </PreferenceSection>

      <PreferenceSection
        title="Subscription Alerts"
        description="Receive push notifications for subscription updates"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Push
          </Text>
          <Switch
            value={!!preferences.subscription_push}
            onValueChange={() => handleToggle('subscription_push')}
          />
        </View>
      </PreferenceSection>

      <PreferenceSection
        title="System Alerts"
        description="Receive push notifications for system announcements"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Push
          </Text>
          <Switch
            value={!!preferences.system_push}
            onValueChange={() => handleToggle('system_push')}
          />
        </View>
      </PreferenceSection>

      <PreferenceSection
        title="General Alerts"
        description="Manage general notification preferences"
      >
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Rent Alerts
          </Text>
          <Switch
            value={!!preferences.receive_rent_alerts}
            onValueChange={() => handleToggle('receive_rent_alerts')}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Tax Alerts
          </Text>
          <Switch
            value={!!preferences.receive_tax_alerts}
            onValueChange={() => handleToggle('receive_tax_alerts')}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Vacancy Alerts
          </Text>
          <Switch
            value={!!preferences.receive_vacancy_alerts}
            onValueChange={() => handleToggle('receive_vacancy_alerts')}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Flagged Alerts
          </Text>
          <Switch
            value={!!preferences.receive_flagged_alerts}
            onValueChange={() => handleToggle('receive_flagged_alerts')}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.onSurface }]}>
            Voice Alerts
          </Text>
          <Switch
            value={!!preferences.receive_voice_alerts}
            onValueChange={() => handleToggle('receive_voice_alerts')}
          />
        </View>
      </PreferenceSection>
    </View>
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  toggleLabel: {
    fontSize: 15,
  },
});
