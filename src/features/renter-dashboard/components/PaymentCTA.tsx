import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { RenterRentRecord } from '../../types/renterDashboard';

interface PaymentCTAProps {
  rent: RenterRentRecord;
  onPayPress?: () => void;
}

export function PaymentCTA({ rent, onPayPress }: PaymentCTAProps) {
  const theme = useTheme();
  const router = useRouter();

  const handlePayPress = () => {
    if (onPayPress) {
      onPayPress();
    } else {
      router.push({
        pathname: '/(drawer)/(tabs)/payments/pay-rent',
        params: { rentId: rent.id.toString() },
      });
    }
  };

  const isPayable = rent.payment_status === 'pending' || rent.payment_status === 'overdue';

  if (!isPayable) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.textContainer}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
          {rent.payment_status === 'overdue' ? 'Overdue Payment' : 'Payment Due'}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {rent.payment_status === 'overdue'
            ? 'Your rent is overdue. Please pay immediately to avoid further charges.'
            : 'Your rent is due. Pay now to avoid late fees.'}
        </Text>
      </View>
      <Button
        mode="contained"
        onPress={handlePayPress}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Pay Now
      </Button>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});