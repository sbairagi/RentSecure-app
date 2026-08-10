import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
// @ts-ignore - react-native-webview types may not be installed
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import { paymentService } from '../services/paymentService';
import { useSubscriptionFeatureStore } from '../store/subscriptionStore';

type PaymentResult = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const RAZORPAY_CHECKOUT_HTML = ({ orderId, amount, currency, keyId, name, description }: any) => `
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
      "description": "${description || 'Subscription Payment'}",
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

export default function RazorpayCheckoutScreen() {
  const theme = useTheme();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { clearPendingPayment } = useSubscriptionFeatureStore();

  const { orderId, amount, currency, keyId, name, description } =
    useLocalSearchParams<{
      orderId: string;
      amount: string;
      currency: string;
      keyId: string;
      name?: string;
      description?: string;
    }>();

  const html = useMemo(
    () =>
      RAZORPAY_CHECKOUT_HTML({
        orderId: orderId || '',
        amount: amount || '0',
        currency: currency || 'INR',
        keyId: keyId || '',
        name: name || 'RentSecure',
        description: description || 'Subscription Payment',
      }),
    [orderId, amount, currency, keyId, name, description]
  );

  const parseQueryParams = useCallback((url: string): Record<string, string | null> => {
    const queryIndex = url.indexOf('?');
    if (queryIndex === -1) return {};
    const query = url.slice(queryIndex + 1);
    const params: Record<string, string | null> = {};
    query.split('&').forEach((part) => {
      const equalIndex = part.indexOf('=');
      if (equalIndex >= 0) {
        const key = decodeURIComponent(part.slice(0, equalIndex));
        const value = decodeURIComponent(part.slice(equalIndex + 1));
        params[key] = value;
      }
    });
    return params;
  }, []);

  const handleWebViewMessage = useCallback(
    async (event: { nativeEvent: { data: string } }) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'PAYMENT_SUCCESS') {
          const result: PaymentResult = {
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
          };

          router.replace({
            pathname: '/(drawer)/(tabs)/subscription/payment-status',
            params: {
              status: 'processing',
              orderId: result.razorpay_order_id,
            },
          });

          try {
            const verification = await paymentService.verifyPayment(result);
            clearPendingPayment();
            router.replace({
              pathname: '/(drawer)/(tabs)/subscription/payment-status',
              params: {
                status: verification.status === 'success' ? 'success' : 'failed',
                orderId: result.razorpay_order_id,
              },
            });
          } catch (error) {
            clearPendingPayment();
            router.replace({
              pathname: '/(drawer)/(tabs)/subscription/payment-status',
              params: {
                status: 'failed',
                orderId: result.razorpay_order_id,
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
    [router, clearPendingPayment]
  );

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      const url = navState.url || '';
      if (url.includes('payment_id')) {
        const params = parseQueryParams(url);
        const paymentId = params['razorpay_payment_id'];
        const orderIdParam = params['razorpay_order_id'];
        const signature = params['razorpay_signature'];

        if (paymentId && orderIdParam && signature) {
          handleWebViewMessage({
            nativeEvent: {
              data: JSON.stringify({
                type: 'PAYMENT_SUCCESS',
                razorpay_payment_id: paymentId,
                razorpay_order_id: orderIdParam,
                razorpay_signature: signature,
              }),
            },
          });
        }
      }
    },
    [handleWebViewMessage, parseQueryParams]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ html }}
        onMessage={handleWebViewMessage}
        onNavigationStateChange={handleNavigationStateChange}
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
});
