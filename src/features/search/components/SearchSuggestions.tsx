import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  visible: boolean;
}

export function SearchSuggestions({ suggestions, onSelect, visible }: SearchSuggestionsProps) {
  const router = useRouter();

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onSelect(item)}
        accessibilityLabel={`Search suggestion: ${item}`}
        accessibilityRole="button"
        testID={`suggestion-${item}`}
      >
        <Text style={styles.icon}>🔍</Text>
        <Text style={styles.text} numberOfLines={1}>
          {item}
        </Text>
      </TouchableOpacity>
    ),
    [onSelect]
  );

  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={suggestions}
        renderItem={renderItem}
        keyExtractor={(item, index) => `suggestion-${item}-${index}`}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        testID="search-suggestions-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  icon: {
    fontSize: 16,
    marginRight: 12,
    color: '#9CA3AF',
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
});
