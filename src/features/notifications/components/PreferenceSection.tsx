import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface PreferenceSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const PreferenceSection: React.FC<PreferenceSectionProps> = ({
  title,
  description,
  children,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
      {description && (
        <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
          {description}
        </Text>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 12,
  },
  content: {},
});
