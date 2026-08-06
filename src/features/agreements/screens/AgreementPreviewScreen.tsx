import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AgreementPreviewScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.previewCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Agreement Preview</Text>
        <Text style={[styles.placeholder, { color: theme.subText }]}>
          PDF preview will be rendered here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewCard: {
    margin: Spacing.md,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  placeholder: {
    fontSize: 14,
    textAlign: 'center',
  },
});
