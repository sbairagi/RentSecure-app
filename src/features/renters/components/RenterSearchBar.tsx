import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import type { RenterSearchBarProps } from '../types';

export const RenterSearchBar: React.FC<RenterSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search renters...',
}) => {
  const theme = useTheme();

  return (
    <View style={{ paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm }}>
      <Searchbar
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessible
        accessibilityRole="search"
        accessibilityLabel="Search renters"
        style={[styles.searchbar, { backgroundColor: theme.background }]}
        inputStyle={[styles.input, { color: theme.text }]}
        iconColor={theme.subText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    elevation: 0,
    borderRadius: 10,
  },
  input: {
    fontSize: 15,
  },
});
