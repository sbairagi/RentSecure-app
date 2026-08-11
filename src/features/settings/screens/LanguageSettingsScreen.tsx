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
import { useLanguageStore } from '@/store/languageStore';
import { useNotificationPreference, useUpdateNotificationPreference } from '../hooks';
import { LANGUAGES } from '@/localization/constants/languages';

export default function LanguageSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();
  const { data: prefs, isLoading } = useNotificationPreference();
  const updatePrefs = useUpdateNotificationPreference();

  const backendLanguage = prefs?.language_preference || 'en';
  const currentLanguage = backendLanguage || language;

  const handleLanguageChange = async (lang: string) => {
    const supportedLang = LANGUAGES.find((l) => l.code === lang);
    if (!supportedLang) return;

    await setLanguage(supportedLang.code);
    await updatePrefs.mutateAsync({ language_preference: supportedLang.code });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
          Loading...
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
            Language
          </Text>
        </View>

        {LANGUAGES.map((lang) => (
          <List.Item
            key={lang.code}
            title={lang.nativeName}
            description={lang.name}
            left={(props) => (
              <List.Icon
                {...props}
                icon={currentLanguage === lang.code ? 'check' : 'translate'}
              />
            )}
            onPress={() => handleLanguageChange(lang.code)}
            style={[
              styles.item,
              { backgroundColor: theme.colors.surface },
              currentLanguage === lang.code && { backgroundColor: theme.colors.primaryContainer },
            ]}
            titleStyle={
              currentLanguage === lang.code
                ? { color: theme.colors.onPrimaryContainer, fontWeight: '600' }
                : { color: theme.colors.onSurface }
            }
          />
        ))}
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
  item: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
});
