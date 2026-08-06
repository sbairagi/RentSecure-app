import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

export default function AgreementVersionsScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Title style={styles.title}>Agreement Versions</Title>
      <Text style={[styles.placeholder, { color: theme.subText }]}>
        Version history is available via simple_history on the backend.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.md,
    color: '#111827',
  },
  placeholder: {
    fontSize: 14,
    textAlign: 'center',
  },
});
