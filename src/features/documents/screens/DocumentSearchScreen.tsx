import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { DocumentCard } from '../components/DocumentCard';
import DocumentEmptyState from '../components/DocumentEmptyState';
import DocumentErrorState from '../components/DocumentErrorState';
import { DocumentSkeletonLoader } from '../components/DocumentSkeletonLoader';
import { useDocuments } from '../hooks/useDocuments';
import type { DocumentFilters } from '../types';

export default function DocumentSearchScreen() {
  const router = useRouter();
  const { documents, isLoading, isFetching, error, refresh } = useDocuments();
  const [query, setQuery] = useState('');
  const theme = useTheme();

  const results = query.trim() ? documents.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())) : [];

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <DocumentSkeletonLoader type="list" />
      </View>
    );
  }

  if (error) {
    return <DocumentErrorState message={error} onRetry={refresh} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="Search documents..."
          placeholderTextColor={theme.subText}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {query.trim() === '' ? (
        <DocumentEmptyState />
      ) : results.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={[styles.noResultsText, { color: theme.subText }]}>
            No documents matching "{query}"
          </Text>
        </View>
      ) : (
        results.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onPress={() => router.push(`/(drawer)/(tabs)/documents/${doc.id}`)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: Spacing.md,
  },
  searchInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
