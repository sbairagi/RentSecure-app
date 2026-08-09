import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RetryButtonProps {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  retryCount?: number;
  maxRetries?: number;
}

export function RetryButton({
  onPress,
  label,
  disabled = false,
  retryCount = 0,
  maxRetries = 3,
}: RetryButtonProps) {
  const showRetryCount = retryCount > 0 && retryCount < maxRetries;
  const isMaxRetries = retryCount >= maxRetries;
  const buttonLabel = label || (isMaxRetries ? 'Max Retries Reached' : showRetryCount ? `Retry (${retryCount}/${maxRetries})` : 'Retry');

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled || isMaxRetries}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>
        {buttonLabel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
  },
  disabledButtonText: {
    color: '#94a3b8',
  },
});
