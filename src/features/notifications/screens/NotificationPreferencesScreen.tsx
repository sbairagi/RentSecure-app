import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Switch, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useNotificationPreferences, useUpdatePreferences } from '../hooks';
import { ChannelToggle } from '../components/ChannelToggle';
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
        title="Rent Alerts"
        description="Receive notifications about rent payments and reminders"
      >
        <ChannelToggle
          channel="whatsapp"
          enabled={!!preferences.rent_alerts_whatsapp}
          onToggle={() => handleToggle('rent_alerts_whatsapp')}
        />
        <ChannelToggle
          channel="email"
          enabled={!!preferences.rent_alerts_email}
          onToggle={() => handleToggle('rent_alerts_email')}
        />
      </PreferenceSection>

      <PreferenceSection
        title="Monthly Summary"
        description="Receive monthly rent summary reports"
      >
        <ChannelToggle
          channel="email"
          enabled={!!preferences.monthly_summary_email}
          onToggle={() => handleToggle('monthly_summary_email')}
        />
        <ChannelToggle
          channel="whatsapp"
          enabled={!!preferences.monthly_summary_whatsapp}
          onToggle={() => handleToggle('monthly_summary_whatsapp')}
        />
      </PreferenceSection>

      <PreferenceSection
        title="Payout Alerts"
        description="Receive notifications about rent payout status"
      >
        <ChannelToggle
          channel="whatsapp"
          enabled={!!preferences.payout_alerts_whatsapp}
          onToggle={() => handleToggle('payout_alerts_whatsapp')}
        />
        <ChannelToggle
          channel="email"
          enabled={!!preferences.payout_alerts_email}
          onToggle={() => handleToggle('payout_alerts_email')}
        />
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
