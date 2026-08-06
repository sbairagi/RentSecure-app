import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TextInput, Button } from 'react-native-paper';
import type { PaymentFilters, PaymentMethod, PaymentStatus, PaymentSortOption } from '../types/payments';
import {
  PAYMENT_CONSTANTS,
} from '../constants/payments';

interface PaymentFiltersProps {
  filters: PaymentFilters;
  onFilterChange: (filters: Partial<PaymentFilters>) => void;
  onClear: () => void;
  showDateRange?: boolean;
  showMethodFilter?: boolean;
  showStatusFilter?: boolean;
  showSort?: boolean;
}

export const PaymentFiltersComponent: React.FC<PaymentFiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
  showDateRange = true,
  showMethodFilter = true,
  showStatusFilter = true,
  showSort = true,
}) => {
  const theme = useTheme();

  const statuses: string[] = [
    'pending', 'paid', 'partially_paid', 'failed', 'cancelled', 'refunded', 'processing', 'overdue'
  ];

  const methods: string[] = [
    'cash', 'bank_transfer', 'upi', 'cheque', 'credit_card', 'debit_card', 'wallet', 'net_banking', 'other'
  ];

  const sortOptions: string[] = ['newest', 'oldest', 'amount_high', 'amount_low', 'due_date', 'status'];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.searchRow}>
        <TextInput
          mode="outlined"
          placeholder="Search payments..."
          value={filters.search || ''}
          onChangeText={(text) => onFilterChange({ search: text })}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
          dense
        />
      </View>

      <View style={styles.filterRow}>
        {showStatusFilter && (
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>Status</Text>
            <View style={styles.chipRow}>
              {statuses.map((status) => (
                <Button
                  key={status}
                  mode={filters.status === status ? 'contained' : 'outlined'}
                  onPress={() => onFilterChange({ status: filters.status === status ? '' : status as PaymentStatus })}
                  style={styles.chip}
                  labelStyle={styles.chipLabel}
                  compact
                >
                  {PAYMENT_CONSTANTS.STATUS_LABELS[status as keyof typeof PAYMENT_CONSTANTS.STATUS_LABELS] || status}
                </Button>
              ))}
            </View>
          </View>
        )}

        {showMethodFilter && (
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>Method</Text>
            <View style={styles.chipRow}>
              {methods.map((method) => (
                <Button
                  key={method}
                  mode={filters.payment_method === method ? 'contained' : 'outlined'}
                  onPress={() => onFilterChange({ payment_method: filters.payment_method === method ? '' : method as PaymentMethod })}
                  style={styles.chip}
                  labelStyle={styles.chipLabel}
                  compact
                >
                  {PAYMENT_CONSTANTS.METHOD_LABELS[method as keyof typeof PAYMENT_CONSTANTS.METHOD_LABELS] || method}
                </Button>
              ))}
            </View>
          </View>
        )}

        {showSort && (
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>Sort By</Text>
            <View style={styles.chipRow}>
              {sortOptions.map((option) => (
                <Button
                  key={option}
                  mode={filters.ordering === option ? 'contained' : 'outlined'}
                  onPress={() => onFilterChange({ ordering: filters.ordering === option ? '' : option as PaymentSortOption })}
                  style={styles.chip}
                  labelStyle={styles.chipLabel}
                  compact
                >
                  {PAYMENT_CONSTANTS.SORT_LABELS[option as keyof typeof PAYMENT_CONSTANTS.SORT_LABELS]}
                </Button>
              ))}
            </View>
          </View>
        )}

        {showDateRange && (
          <View style={styles.filterGroup}>
            <Text style={[styles.filterLabel, { color: theme.colors.onSurfaceVariant }]}>Date Range</Text>
            <View style={styles.dateRow}>
              <TextInput
                mode="outlined"
                placeholder="From"
                value={filters.date_from || ''}
                onChangeText={(text) => onFilterChange({ date_from: text })}
                style={styles.dateInput}
                dense
              />
              <TextInput
                mode="outlined"
                placeholder="To"
                value={filters.date_to || ''}
                onChangeText={(text) => onFilterChange({ date_to: text })}
                style={styles.dateInput}
                dense
              />
            </View>
          </View>
        )}

        <View style={styles.actionRow}>
          <Button mode="text" onPress={onClear} compact>
            Clear Filters
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchRow: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'transparent',
  },
  filterRow: {
    gap: 16,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minWidth: 60,
  },
  chipLabel: {
    fontSize: 11,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateInput: {
    flex: 1,
  },
  actionRow: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
});
