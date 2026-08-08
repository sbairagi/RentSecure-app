import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface UpgradePromptProps {
  onUpgrade?: () => void;
  message?: string;
}

export function UpgradePrompt({
  onUpgrade,
  message = 'Upgrade your plan to access AI Assistant',
}: UpgradePromptProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <MaterialCommunityIcons
        name="crown-outline"
        size={48}
        color={theme.colors.primary}
      />
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {message}
      </Text>
      <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
        AI Assistant is available on Pro and Elite plans.
      </Text>
      {onUpgrade && (
        <Button
          mode="contained"
          onPress={onUpgrade}
          style={styles.button}
          icon="arrow-up-circle"
        >
          Upgrade Plan
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    minWidth: 200,
  },
});
