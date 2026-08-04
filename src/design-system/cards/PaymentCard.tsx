import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { radius, spacing } from '../tokens';
import { Card } from './Card';

export interface PaymentCardProps {
  method: string;
  last4?: string;
  expiryDate?: string;
  isDefault?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  method,
  last4,
  expiryDate,
  isDefault = false,
  onPress,
  onDelete,
  style,
}) => {
  const theme = useDesignSystemTheme();

  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.header}>
        <View style={styles.methodContainer}>
          <Text style={[styles.method, { color: theme.colors.neutral[900] }]}>{method}</Text>
          {last4 && (
            <Text style={[styles.last4, { color: theme.colors.neutral[500] }]}>**** {last4}</Text>
          )}
        </View>
        {isDefault && (
          <View style={[styles.defaultBadge, { backgroundColor: theme.colors.primary[100] }]}>
            <Text style={[styles.defaultText, { color: theme.colors.primary[700] }]}>Default</Text>
          </View>
        )}
      </View>
      {expiryDate && (
        <Text style={[styles.expiry, { color: theme.colors.neutral[400] }]}>
          Expires {expiryDate}
        </Text>
      )}
      {onDelete && (
        <Text style={[styles.deleteText, { color: theme.colors.error[500] }]} onPress={onDelete}>
          Remove
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  methodContainer: {
    flex: 1,
  },
  method: {
    fontSize: 15,
    fontWeight: '600',
  },
  last4: {
    fontSize: 13,
    marginTop: spacing.xs,
  },
  defaultBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: '500',
  },
  expiry: {
    fontSize: 12,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: spacing.sm,
    textAlign: 'right',
  },
});
