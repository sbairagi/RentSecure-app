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
import { useAlertPreferences, useUpdateAlertPreferences } from '../hooks';

export default function NotificationSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: alertPrefs, isLoading, refetch } = useAlertPreferences();
  const updatePrefs = useUpdateAlertPreferences();

  const handleToggle = async (key: string, value: boolean) => {
    if (!alertPrefs) return;
    await updatePrefs.mutateAsync({ [key]: value } as any);
    await refetch();
  };

  const getPref = (key: string, fallback: boolean): boolean => {
    if (!alertPrefs) return fallback;
    return (alertPrefs as any)[key] ?? fallback;
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
