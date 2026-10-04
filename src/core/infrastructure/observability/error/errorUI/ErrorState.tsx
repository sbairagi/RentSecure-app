import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ErrorCategory } from '../../types';

interface ErrorStateProps {
  category?: ErrorCategory;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  retryLabel?: string;
  showGoHome?: boolean;
}

export function ErrorState({
  category = 'UNKNOWN_ERROR',
  title,
  message,
  onRetry,
  onGoHome,
  retryLabel = 'Try Again',
  showGoHome = true,
}: ErrorStateProps) {
  const icon = getIconForCategory(category);
  const color = getColorForCategory(category);

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: color.bg }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title || getDefaultTitle(category)}</Text>
      <Text style={styles.message}>
        {message || getDefaultMessage(category)}
      </Text>
      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: color.primary }]} onPress={onRetry}>
            <Text style={styles.primaryButtonText}>{retryLabel}</Text>
          </TouchableOpacity>
        )}
        {showGoHome && onGoHome && (
          <TouchableOpacity style={styles.secondaryButton} onPress={onGoHome}>
            <Text style={styles.secondaryButtonText}>Go Home</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function getIconForCategory(category: ErrorCategory): string {
  switch (category) {
    case 'NETWORK_ERROR':
    case 'OFFLINE':
      return '📡';
    case 'AUTHENTICATION_ERROR':
      return '🔐';
    case 'AUTHORIZATION_ERROR':
      return '🚫';
    case 'VALIDATION_ERROR':
      return '📝';
    case 'NOT_FOUND':
      return '🔍';
    case 'CONFLICT':
      return '⚡';
    case 'RATE_LIMIT':
      return '⏳';
    case 'SERVER_ERROR':
      return '🔧';
    case 'TIMEOUT':
      return '⏱️';
    case 'PAYMENT_ERROR':
      return '💳';
    case 'SUBSCRIPTION_ERROR':
      return '📋';
    case 'UPLOAD_ERROR':
      return '📤';
    default:
      return '⚠️';
  }
}

function getColorForCategory(category: ErrorCategory): { bg: string; primary: string } {
  switch (category) {
    case 'NETWORK_ERROR':
    case 'OFFLINE':
      return { bg: '#fef2f2', primary: '#ef4444' };
    case 'AUTHENTICATION_ERROR':
      return { bg: '#fef2f2', primary: '#4f46e5' };
    case 'AUTHORIZATION_ERROR':
      return { bg: '#fffbeb', primary: '#f59e0b' };
    case 'VALIDATION_ERROR':
      return { bg: '#eff6ff', primary: '#3b82f6' };
    case 'NOT_FOUND':
      return { bg: '#f8fafc', primary: '#64748b' };
    case 'CONFLICT':
      return { bg: '#fef3c7', primary: '#f59e0b' };
    case 'RATE_LIMIT':
      return { bg: '#fffbeb', primary: '#f59e0b' };
    case 'SERVER_ERROR':
      return { bg: '#fef2f2', primary: '#ef4444' };
    case 'TIMEOUT':
      return { bg: '#fef3c7', primary: '#f59e0b' };
    case 'PAYMENT_ERROR':
      return { bg: '#fef2f2', primary: '#ef4444' };
    case 'SUBSCRIPTION_ERROR':
      return { bg: '#eff6ff', primary: '#3b82f6' };
    case 'UPLOAD_ERROR':
      return { bg: '#f0fdf4', primary: '#22c55e' };
    default:
      return { bg: '#f8fafc', primary: '#4f46e5' };
  }
}

function getDefaultTitle(category: ErrorCategory): string {
  switch (category) {
    case 'NETWORK_ERROR':
    case 'OFFLINE':
      return 'No Internet Connection';
    case 'AUTHENTICATION_ERROR':
      return 'Session Expired';
    case 'AUTHORIZATION_ERROR':
      return 'Access Denied';
    case 'VALIDATION_ERROR':
      return 'Invalid Input';
    case 'NOT_FOUND':
      return 'Not Found';
    case 'CONFLICT':
      return 'Conflict';
    case 'RATE_LIMIT':
      return 'Too Many Requests';
    case 'SERVER_ERROR':
      return 'Server Error';
    case 'TIMEOUT':
      return 'Request Timed Out';
    case 'PAYMENT_ERROR':
      return 'Payment Failed';
    case 'SUBSCRIPTION_ERROR':
      return 'Subscription Error';
    case 'UPLOAD_ERROR':
      return 'Upload Failed';
    default:
      return 'Something Went Wrong';
  }
}

function getDefaultMessage(category: ErrorCategory): string {
  switch (category) {
    case 'NETWORK_ERROR':
    case 'OFFLINE':
      return 'Please check your internet connection and try again.';
    case 'AUTHENTICATION_ERROR':
      return 'Your session has expired. Please log in again.';
    case 'AUTHORIZATION_ERROR':
      return 'You do not have permission to access this resource.';
    case 'VALIDATION_ERROR':
      return 'Please check the information and try again.';
    case 'NOT_FOUND':
      return 'The requested resource could not be found.';
    case 'CONFLICT':
      return 'The request could not be completed due to a conflict.';
    case 'RATE_LIMIT':
      return 'Too many requests. Please wait a moment and try again.';
    case 'SERVER_ERROR':
      return 'Something went wrong on our end. Please try again later.';
    case 'TIMEOUT':
      return 'The request took too long. Please try again.';
    case 'PAYMENT_ERROR':
      return 'Payment could not be processed. Please try again.';
    case 'SUBSCRIPTION_ERROR':
      return 'Subscription operation failed. Please try again.';
    case 'UPLOAD_ERROR':
      return 'Upload failed. Please check your connection and try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '500',
  },
});
