import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { authApi } from '@/services/auth/auth';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    setError('');
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await authApi.sendOtp(phone);
      router.push({
        pathname: '/(auth)/otp',
        params: { phone },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Welcome
        </ThemedText>
        <ThemedText style={styles.subtitle}>Enter your phone number to continue</ThemedText>
      </ThemedView>

      <View style={styles.form}>
        <AppInput
          label="Phone Number"
          placeholder="+91 99999 99999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoFocus
          error={error}
        />

        <AppButton title="Send OTP" onPress={handleSendOtp} loading={loading} disabled={loading} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    marginTop: Spacing.lg,
  },
});
