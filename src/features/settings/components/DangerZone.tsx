import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface DangerZoneProps {
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function DangerZone({
  title,
  description,
  buttonLabel,
  onPress,
  loading = false,
  disabled = false,
}: DangerZoneProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.error }]}>{title}</Text>
        <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
          {description}
        </Text>
      </View>
      <Button
        mode="outlined"
        onPress={onPress}
        loading={loading}
        disabled={disabled || loading}
        textColor={theme.colors.error}
        style={[styles.button, { borderColor: theme.colors.error }]}
      >
        {buttonLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
