import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export const DocumentFilterSheet: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.subText }]}>Filters are not supported by the current backend.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  text: {
    fontSize: 14,
  },
});
