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
import { useThemeStore } from '@/store/themeStore';
import type { ThemeMode } from '../types';

const THEME_OPTIONS: { label: string; value: ThemeMode; icon: string }[] = [
  { label: 'Light', value: 'light', icon: 'white-balance-sunny' },
  { label: 'Dark', value: 'dark', icon: 'weather-night' },
  { label: 'System', value: 'system', icon: 'brightness-auto' },
];

export default function ThemeSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { mode, setMode } = useThemeStore();

  const handleThemeChange = async (newMode: ThemeMode) => {
    await setMode(newMode);
  };

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Theme
          </Text>
        </View>

        {THEME_OPTIONS.map((option) => (
          <List.Item
            key={option.value}
            title={option.label}
            left={(props) => <List.Icon {...props} icon={option.icon} />}
            right={(props) => (
              <List.Icon
                {...props}
                icon={mode === option.value ? 'check-circle' : 'circle-outline'}
              />
            )}
            onPress={() => handleThemeChange(option.value)}
            style={[
              styles.item,
              { backgroundColor: theme.colors.surface },
              mode === option.value && { backgroundColor: theme.colors.primaryContainer },
            ]}
            titleStyle={
              mode === option.value
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
