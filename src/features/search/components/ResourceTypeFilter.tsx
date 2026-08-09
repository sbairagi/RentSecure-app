import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';
import type { SearchResourceType } from '../types/search.types';

interface ResourceTypeFilterProps {
  selectedTypes: SearchResourceType[];
  onToggle: (type: SearchResourceType) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function ResourceTypeFilter({
  selectedTypes,
  onToggle,
  onSelectAll,
  onClearAll,
}: ResourceTypeFilterProps) {
  const resourceTypes = Object.entries(SEARCH_CONSTANTS.RESOURCE_TYPES) as [SearchResourceType, typeof SEARCH_CONSTANTS.RESOURCE_TYPES[SearchResourceType]][];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Filter by type</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={onSelectAll} accessibilityLabel="Select all types">
            <Text style={styles.actionText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClearAll} accessibilityLabel="Clear type filters">
            <Text style={styles.actionText}>None</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.grid}>
        {resourceTypes.map(([key, config]) => {
          const isSelected = selectedTypes.includes(key);
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? `${config.color}15` : '#F3F4F6',
                  borderColor: isSelected ? config.color : '#E5E7EB',
                },
              ]}
              onPress={() => onToggle(key)}
              accessibilityLabel={`${config.label} filter`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              <Text style={styles.icon}>{config.icon}</Text>
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? config.color : '#6B7280' },
                ]}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4F46E5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 36,
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
