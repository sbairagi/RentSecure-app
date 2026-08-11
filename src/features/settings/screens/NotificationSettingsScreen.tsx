import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import { SettingsSection, SettingsItem } from '../components';
import { useNotificationPreference, useUpdateNotificationPreference } from '../hooks';

export default function NotificationSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: prefs, isLoading, refetch } = useNotificationPreference();
  const updatePrefs = useUpdateNotificationPreference();

  const handleToggle = async (key: string, value: boolean) => {
    if (!prefs) return;
    await updatePrefs.mutateAsync({ [key]: value } as any);
    await refetch();
  };

  const getPref = (key: string, fallback: boolean): boolean => {
    if (!prefs) return fallback;
    return (prefs as any)[key] ?? fallback;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
          Loading preferences...
        </Text>
      </View>
    );
  }

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Notification Settings
          </Text>
        </View>

        <SettingsSection title="Push Notifications" description="Manage push notification settings">
          <SettingsItem
            id="push_enabled"
            label="Enable Push Notifications"
            type="toggle"
            value={getPref('push_enabled', true)}
            onToggle={(val) => handleToggle('push_enabled', val)}
          />
          <SettingsItem
            id="maintenance_push"
            label="Maintenance Alerts"
            type="toggle"
            value={getPref('maintenance_push', true)}
            onToggle={(val) => handleToggle('maintenance_push', val)}
          />
          <SettingsItem
            id="visitor_push"
            label="Visitor Alerts"
            type="toggle"
            value={getPref('visitor_push', true)}
            onToggle={(val) => handleToggle('visitor_push', val)}
          />
          <SettingsItem
            id="agreement_push"
            label="Agreement Alerts"
            type="toggle"
            value={getPref('agreement_push', true)}
            onToggle={(val) => handleToggle('agreement_push', val)}
          />
          <SettingsItem
            id="subscription_push"
            label="Subscription Alerts"
            type="toggle"
            value={getPref('subscription_push', true)}
            onToggle={(val) => handleToggle('subscription_push', val)}
          />
          <SettingsItem
            id="system_push"
            label="System Alerts"
            type="toggle"
            value={getPref('system_push', true)}
            onToggle={(val) => handleToggle('system_push', val)}
          />
        </SettingsSection>

        <SettingsSection title="Rent Alerts" description="Notifications about rent payments">
          <SettingsItem
            id="rent_whatsapp"
            label="WhatsApp"
            type="toggle"
            value={getPref('rent_alerts_whatsapp', true)}
            onToggle={(val) => handleToggle('rent_alerts_whatsapp', val)}
          />
          <SettingsItem
            id="rent_email"
            label="Email"
            type="toggle"
            value={getPref('rent_alerts_email', true)}
            onToggle={(val) => handleToggle('rent_alerts_email', val)}
          />
        </SettingsSection>

        <SettingsSection title="Monthly Summary" description="Monthly rent summary reports">
          <SettingsItem
            id="monthly_email"
            label="Email"
            type="toggle"
            value={getPref('monthly_summary_email', true)}
            onToggle={(val) => handleToggle('monthly_summary_email', val)}
          />
          <SettingsItem
            id="monthly_whatsapp"
            label="WhatsApp"
            type="toggle"
            value={getPref('monthly_summary_whatsapp', false)}
            onToggle={(val) => handleToggle('monthly_summary_whatsapp', val)}
          />
        </SettingsSection>

        <SettingsSection title="Payout Alerts" description="Notifications about rent payout status">
          <SettingsItem
            id="payout_whatsapp"
            label="WhatsApp"
            type="toggle"
            value={getPref('payout_alerts_whatsapp', true)}
            onToggle={(val) => handleToggle('payout_alerts_whatsapp', val)}
          />
          <SettingsItem
            id="payout_email"
            label="Email"
            type="toggle"
            value={getPref('payout_alerts_email', false)}
            onToggle={(val) => handleToggle('payout_alerts_email', val)}
          />
        </SettingsSection>

        <SettingsSection title="General Alerts" description="Manage general notification preferences">
          <SettingsItem
            id="rent_alerts"
            label="Rent Alerts"
            type="toggle"
            value={getPref('receive_rent_alerts', true)}
            onToggle={(val) => handleToggle('receive_rent_alerts', val)}
          />
          <SettingsItem
            id="tax_alerts"
            label="Tax Alerts"
            type="toggle"
            value={getPref('receive_tax_alerts', true)}
            onToggle={(val) => handleToggle('receive_tax_alerts', val)}
          />
          <SettingsItem
            id="vacancy_alerts"
            label="Vacancy Alerts"
            type="toggle"
            value={getPref('receive_vacancy_alerts', true)}
            onToggle={(val) => handleToggle('receive_vacancy_alerts', val)}
          />
          <SettingsItem
            id="flagged_alerts"
            label="Flagged Alerts"
            type="toggle"
            value={getPref('receive_flagged_alerts', true)}
            onToggle={(val) => handleToggle('receive_flagged_alerts', val)}
          />
          <SettingsItem
            id="voice_alerts"
            label="Voice Alerts"
            type="toggle"
            value={getPref('receive_voice_alerts', true)}
            onToggle={(val) => handleToggle('receive_voice_alerts', val)}
          />
        </SettingsSection>
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
