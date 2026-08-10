import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import WebView from 'react-native-webview';
import { showMessage } from 'react-native-flash-message';
import { useInitiateRenterPayment, useVerifyRenterPayment } from '../hooks/useRenterPayments';

type PaymentResult = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const RAZORPAY_CHECKOUT_HTML = ({
  orderId,
  amount,
  currency,
  keyId,
  name,
  description,
}: {
  orderId: string;
  amount: string;
  currency: string;
  keyId: string;
  name: string;
  description: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body style="margin:0;padding:0;background:#fff;">
  <button id="rzp-button1" style="display:none">Pay</button>
  <script>
    var options = {
      "key": "${keyId}",
      "amount": "${amount}",
      "currency": "${currency}",
      "name": "${name || 'RentSecure'}",
      "description": "${description || 'Rent Payment'}",
      "order_id": "${orderId}",
      "handler": function (response){
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'PAYMENT_SUCCESS',
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        }));
      },
      "prefill": {
        "method": "upi"
      },
      "theme": {
        "color": "#4F46E5"
      }
    };
    var rzp1 = new Razorpay(options);
    document.getElementById('rzp-button1').onclick = function(e){
      rzp1.open();
      e.preventDefault();
    }
    document.getElementById('rzp-button1').click();
  </script>
</body>
</html>
`;

export default function PayRentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const { rentId } = useLocalSearchParams<{ rentId: string }>();

  const initiateMutation = useInitiateRenterPayment();
  const verifyMutation = useVerifyRenterPayment();

  const html = useMemo(() => {
    const orderData = initiateMutation.data;
    if (!orderData) return '';
    return RAZORPAY_CHECKOUT_HTML({
      orderId: orderData.order_id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId: orderData.key_id,
      name: 'RentSecure',
      description: 'Rent Payment',
    });
  }, [initiateMutation.data]);

  React.useEffect(() => {
    if (rentId && !initiateMutation.data && !initiateMutation.isPending) {
      initiateMutation.mutate(Number(rentId));
    }
  }, [rentId, initiateMutation]);

  const handleWebViewMessage = useCallback(
    async (event: { nativeEvent: { data: string } }) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'PAYMENT_SUCCESS') {
          setVerificationStatus('processing');
          router.replace({
            pathname: '/(drawer)/(tabs)/payment-status',
            params: {
              status: 'processing',
              orderId: data.razorpay_order_id,
            },
          });

          try {
            const verification = await verifyMutation.mutateAsync({
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
            });

            setVerificationStatus('success');
            router.replace({
              pathname: '/(drawer)/(tabs)/payment-status',
              params: {
                status: 'success',
                orderId: data.razorpay_order_id,
              },
            });
            showMessage({
              message: verification.message || 'Payment verified successfully',
              type: 'success',
            });
          } catch (error) {
            setVerificationStatus('failed');
            router.replace({
              pathname: '/(drawer)/(tabs)/payment-status',
              params: {
                status: 'failed',
                orderId: data.razorpay_order_id,
              },
            });
            showMessage({
              message: error instanceof Error ? error.message : 'Payment verification failed',
              type: 'danger',
            });
          }
        }
      } catch {
        // ignore non-JSON messages
      }
    },
    [router, verifyMutation]
  );

  if (initiateMutation.isPending && !initiateMutation.data) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            Preparing payment...
          </Text>
        </View>
      </View>
    );
  }

  if (initiateMutation.isError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: theme.colors.onSurface }]}>
            Payment Initiation Failed
          </Text>
          <Text style={[styles.errorDescription, { color: theme.colors.onSurfaceVariant }]}>
            {initiateMutation.error instanceof Error
              ? initiateMutation.error.message
              : 'Could not initiate payment. Please try again.'}
          </Text>
          <Text
            style={[styles.retryButton, { color: theme.colors.primary }]}
            onPress={() => {
              if (rentId) {
                initiateMutation.mutate(Number(rentId));
              }
            }}
          >
            Tap to retry
          </Text>
          <Text
            style={[styles.backButton, { color: theme.colors.onSurfaceVariant }]}
            onPress={() => router.back()}
          >
            Go Back
          </Text>
        </View>
      </View>
    );
  }

  if (!initiateMutation.data) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      {verificationStatus === 'processing' && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.processingText, { color: theme.colors.onSurface }]}>
            Verifying payment...
          </Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ html }}
        onMessage={handleWebViewMessage}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
        mixedContentMode="compatibility"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 10,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 20,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  errorDescription: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  backButton: {
    fontSize: 14,
    marginTop: 12,
  },
});
