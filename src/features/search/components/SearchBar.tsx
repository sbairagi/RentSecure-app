import React, { useRef } from 'react';
import { StyleSheet, TextInput, View, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  suggestionsLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  isLoading = false,
  suggestionsLoading = false,
  placeholder = 'Search across buildings, units, renters...',
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          accessibilityLabel="Search"
          accessibilityHint="Search across buildings, units, renters, and more"
          testID="search-bar-input"
        />
        {value.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            onPress={() => onChangeText('')}
            style={styles.clearButton}
            accessibilityLabel="Clear search"
            accessibilityHint="Clear the search text"
            testID="search-bar-clear"
          />
        )}
        {(isLoading || suggestionsLoading) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4F46E5" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
    minHeight: 44,
  },
  clearButton: {
    margin: 0,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingRight: 4,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
