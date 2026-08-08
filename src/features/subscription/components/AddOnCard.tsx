import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  Chip,
  useTheme,
} from 'react-native-paper';
import type { AddOnPurchase } from '../types';
import { formatCurrency } from '../utils/formatting';

interface AddOnCardProps {
  addOn: AddOnPurchase;
  onDelete?: () => void;
  showDelete?: boolean;
}

export function AddOnCard({ addOn, onDelete, showDelete = false }: AddOnCardProps) {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.colors.onSurface }]}>
              {addOn.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </Text>
            <Text style={[styles.amount, { color: theme.colors.primary }]}>
              {formatCurrency(addOn.amount)}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Chip 
              mode="flat" 
              compact
              style={{ backgroundColor: addOn.is_recurring ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
              textStyle={{ color: addOn.is_recurring ? theme.colors.primary : theme.colors.onSurfaceVariant }}
            >
              {addOn.is_recurring ? 'Recurring' : 'One-time'}
            </Chip>
            {showDelete && onDelete && (
              <IconButton
                icon="delete-outline"
                size={20}
                iconColor={theme.colors.error}
                onPress={onDelete}
              />
            )}
          </View>
        </View>
        <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
          Purchased: {new Date(addOn.purchase_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    marginTop: 8,
  },
});
