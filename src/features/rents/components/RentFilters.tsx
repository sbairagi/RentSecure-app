import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { RentFilters, RentPaymentStatus, RentPaymentMethod } from '../types/rents';
import { RENT_CONSTANTS } from '../constants/rents';

interface RentFiltersProps {
  filters: RentFilters;
  onFilterChange: (filters: RentFilters) => void;
  onClear?: () => void;
  showSearch?: boolean;
  showStatus?: boolean;
  showPaymentMethod?: boolean;
}

export const RentFilters: React.FC<RentFiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
  showSearch = true,
  showStatus = true,
  showPaymentMethod = true,
}) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState(filters.search || '');

  const statuses: RentPaymentStatus[] = ['pending', 'paid', 'overdue', 'cancelled'];
  const methods: RentPaymentMethod[] = ['cash', 'bank_transfer', 'upi', 'cheque', 'card', 'online', 'other'];

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    onFilterChange({ ...filters, search: text || undefined });
  }, [filters, onFilterChange]);

  const handleStatusChange = useCallback((status: RentPaymentStatus | '') => {
    onFilterChange({ ...filters, status: status || undefined });
  }, [filters, onFilterChange]);

  const handleMethodChange = useCallback((method: RentPaymentMethod | '') => {
    onFilterChange({ ...filters, payment_method: method || undefined });
  }, [filters, onFilterChange]);

  const handleClear = useCallback(() => {
    setSearchText('');
    onClear?.();
  }, [onClear]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {showSearch && (
        <View style={[styles.searchContainer, { borderColor: theme.colors.outline }]}>
          <Text style={[styles.searchIcon, { color: theme.colors.onSurfaceVariant }]}>🔍</Text>
          <Text
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholder="Search rent records..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchText}
            onChangeText={handleSearchChange}
          />
          {searchText.length > 0 && (
            <Text style={[styles.clearButton, { color: theme.colors.primary }]} onPress={() => handleSearchChange('')}>
              ✕
            </Text>
          )}
        </View>
      )}

      <View style={styles.filterRow}>
        {showStatus && (
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>Status</Text>
            <View style={styles.chipRow}>
              {statuses.map((status) => {
                const isActive = filters.status === status;
                const config = RENT_CONSTANTS.STATUS_CONFIG[status];
                return (
                  <Text
                    key={status}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isActive ? config.backgroundColor : theme.colors.surface,
                        borderColor: isActive ? config.color : theme.colors.outline,
                      },
                    ]}
                    onPress={() => handleStatusChange(isActive ? '' : status)}
                  >
                    <Text style={[styles.chipText, { color: isActive ? config.color : theme.colors.onSurface }]}>
                      {config.label}
                    </Text>
                  </Text>
                );
              })}
            </View>
          </View>
        )}

        {showPaymentMethod && (
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>Method</Text>
            <View style={styles.chipRow}>
              {methods.slice(0, 5).map((method) => {
                const isActive = filters.payment_method === method;
                const config = RENT_CONSTANTS.METHOD_CONFIG[method];
                return (
                  <Text
                    key={method}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isActive ? config.color + '20' : theme.colors.surface,
                        borderColor: isActive ? config.color : theme.colors.outline,
                      },
                    ]}
                    onPress={() => handleMethodChange(isActive ? '' : method)}
                  >
                    <Text style={[styles.chipText, { color: isActive ? config.color : theme.colors.onSurface }]}>
                      {config.label}
                    </Text>
                  </Text>
                );
              })}
            </View>
          </View>
        )}

        {onClear && (filters.search || filters.status || filters.payment_method) && (
          <Text style={[styles.clearAll, { color: theme.colors.primary }]} onPress={handleClear}>
            Clear All
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  clearButton: {
    fontSize: 16,
    paddingHorizontal: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  filterGroup: {
    flex: 1,
    minWidth: 150,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  clearAll: {
    fontSize: 13,
    fontWeight: '600',
    alignSelf: 'center',
  },
});
