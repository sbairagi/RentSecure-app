import React from 'react';
import { AppState, Platform } from 'react-native';
import { observabilityLogger } from '../logging';
import type { ErrorCategory, ErrorContext } from '../types';
import { classifyHttpError, classifyNetworkError } from '../utils/classify';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, context: ErrorContext) => void;
  enabled?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  category: ErrorCategory;
  context: ErrorContext;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static defaultProps = {
    enabled: true,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      category: 'UNKNOWN_ERROR',
      context: {},
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const category = ErrorBoundary.categorizeError(error);
    return {
      hasError: true,
      error,
      category,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const context: ErrorContext = {
      ...this.state.context,
      platform: Platform.OS,
    };

    const sanitizedError = new Error(error.message) as Error & { stack?: string };
    sanitizedError.stack = error.stack?.split('\n').slice(0, 10).join('\n');

    observabilityLogger.error(`Unhandled render error: ${error.message}`, {
      ...sanitizedError,
      componentStack: errorInfo.componentStack?.split('\n').slice(0, 20).join('\n'),
      platform: Platform.OS,
    });

    this.props.onError?.(error, context);
  }

  private static categorizeError(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();
    if (message.includes('network') || message.includes('offline') || message.includes('fetch')) return 'NETWORK_ERROR';
    if (message.includes('auth') || message.includes('token') || message.includes('unauthorized')) return 'AUTHENTICATION_ERROR';
    if (message.includes('permission') || message.includes('forbidden') || message.includes('403')) return 'AUTHORIZATION_ERROR';
    if (message.includes('validation') || message.includes('invalid') || message.includes('422')) return 'VALIDATION_ERROR';
    if (message.includes('not found') || message.includes('404')) return 'NOT_FOUND';
    if (message.includes('conflict') || message.includes('409')) return 'CONFLICT';
    if (message.includes('rate limit') || message.includes('429')) return 'RATE_LIMIT';
    if (message.includes('payment') || message.includes('razorpay') || message.includes('cashfree')) return 'PAYMENT_ERROR';
    if (message.includes('subscription')) return 'SUBSCRIPTION_ERROR';
    if (message.includes('upload') || message.includes('document')) return 'UPLOAD_ERROR';
    return 'UNKNOWN_ERROR';
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      category: 'UNKNOWN_ERROR',
      context: {},
    });
  };

  render(): React.ReactNode {
    if (this.props.enabled && this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return this.renderDefaultFallback();
    }
    return this.props.children;
  }

  private renderDefaultFallback(): React.ReactNode {
    const { error, category } = this.state;
    const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;
    return (
      <DefaultErrorFallback
        error={error}
        category={category}
        onRetry={this.handleRetry}
        isDev={isDev}
      />
    );
  }
}

function DefaultErrorFallback({
  error,
  category,
  onRetry,
  isDev,
}: {
  error: Error | null;
  category: ErrorCategory;
  onRetry: () => void;
  isDev: boolean;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>
        {isDev && error ? error.message : 'An unexpected error occurred. Please restart the app.'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );
}

const { View, Text, TouchableOpacity, StyleSheet } = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
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
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
