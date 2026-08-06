import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface UnitSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const UnitSearchBar: React.FC<UnitSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search units...',
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
      />
      {value.length > 0 && (
        <Text style={styles.clearButton} onPress={() => onChangeText('')}>
          ✕
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    marginLeft: 4,
    fontSize: 15,
    paddingVertical: 4,
  },
  clearButton: {
    color: '#9ca3af',
    fontSize: 16,
    paddingHorizontal: 4,
  },
});
