import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface CaretakerSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const CaretakerSearchBar: React.FC<CaretakerSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search caretakers...',
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.searchIcon, { color: theme.subText }]}>🔍</Text>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.subText}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Text style={[styles.clearIcon, { color: theme.subText }]}>✕</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },
  clearIcon: {
    fontSize: 16,
    paddingHorizontal: 4,
  },
});
