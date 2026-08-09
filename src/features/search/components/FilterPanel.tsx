import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';
import type { SearchResourceType, SearchOrdering } from '../types/search.types';

interface FilterPanelProps {
  filters: {
    resource_type: SearchResourceType[];
    ordering: SearchOrdering;
  };
  onResourceTypesChange: (types: SearchResourceType[]) => void;
  onOrderingChange: (ordering: SearchOrdering) => void;
  onApply: () => void;
  onClear: () => void;
  isExpanded: boolean;
}

export function FilterPanel({
  filters,
  onResourceTypesChange,
  onOrderingChange,
  onApply,
  onClear,
  isExpanded,
}: FilterPanelProps) {
  const theme = useTheme();
  const resourceTypes = Object.entries(SEARCH_CONSTANTS.RESOURCE_TYPES) as [SearchResourceType, typeof SEARCH_CONSTANTS.RESOURCE_TYPES[SearchResourceType]][];

  const toggleResourceType = (type: SearchResourceType) => {
    const current = filters.resource_type;
    if (current.includes(type)) {
      onResourceTypesChange(current.filter((t) => t !== type));
    } else {
      onResourceTypesChange([...current, type]);
    }
  };

  if (!isExpanded) return null;

  const orderingOptions: { value: SearchOrdering; label: string }[] = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Resource Types
      </Text>
      <View style={styles.resourceTypeContainer}>
        {resourceTypes.map(([key, config]) => {
          const isSelected = filters.resource_type.includes(key);
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.resourceTypeChip,
                {
                  backgroundColor: isSelected ? `${config.color}15` : '#F3F4F6',
                  borderColor: isSelected ? config.color : '#E5E7EB',
                },
              ]}
              onPress={() => toggleResourceType(key)}
              accessibilityLabel={`Filter by ${config.label}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              <Text style={styles.resourceTypeIcon}>{config.icon}</Text>
              <Text
                style={[
                  styles.resourceTypeLabel,
                  { color: isSelected ? config.color : '#6B7280' },
                ]}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface, marginTop: 16 }]}>
        Sort By
      </Text>
      <View style={styles.orderingContainer}>
        {orderingOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.orderingChip,
              {
                backgroundColor: filters.ordering === option.value ? '#4F46E5' : '#F3F4F6',
              },
            ]}
            onPress={() => onOrderingChange(option.value)}
            accessibilityLabel={`Sort by ${option.label}`}
            accessibilityRole="radio"
            accessibilityState={{ selected: filters.ordering === option.value }}
          >
            <Text
              style={[
                styles.orderingLabel,
                { color: filters.ordering === option.value ? '#FFFFFF' : '#6B7280' },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={onClear} style={styles.button}>
          Clear
        </Button>
        <Button mode="contained" onPress={onApply} style={styles.button}>
          Apply Filters
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  resourceTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resourceTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 36,
  },
  resourceTypeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  resourceTypeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  orderingChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 36,
  },
  orderingLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  button: {
    minWidth: 80,
  },
});
