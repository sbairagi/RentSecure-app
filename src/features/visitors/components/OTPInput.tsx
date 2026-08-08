import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onResend?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
  expirySeconds?: number;
  attemptsRemaining?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onResend,
  autoFocus = false,
  disabled = false,
  expirySeconds = 300,
  attemptsRemaining,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [timeLeft, setTimeLeft] = useState(expirySeconds);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0 && intervalRef.current) {
          clearInterval(intervalRef.current);
          setIsExpired(true);
        }
        return next;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTimer]);

  const handleChange = (text: string, index: number) => {
    const digit = text.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus?.();
    }

    const fullOtp = newOtp.join("");
    if (fullOtp.length === length && onComplete) {
      onComplete(fullOtp);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus?.();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = useCallback(() => {
    setTimeLeft(expirySeconds);
    setIsExpired(false);
    setOtp(Array(length).fill(""));
    onResend?.();
    startTimer();
  }, [expirySeconds, length, onResend, startTimer]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your device
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            autoFocus={autoFocus && index === 0}
            editable={!disabled && !isExpired}
            selectionColor="#3b82f6"
          />
        ))}
      </View>

      {isExpired ? (
        <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.timer}>
          Expires in {formatTime(timeLeft)}
        </Text>
      )}

      {attemptsRemaining != null && !isExpired && (
        <Text style={styles.attemptsText}>
          {attemptsRemaining} attempts remaining
        </Text>
      )}

      {isExpired && (
        <Text style={styles.expiredText}>OTP has expired. Please request a new one.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  timer: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  attemptsText: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 12,
  },
  resendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
  },
  resendText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  expiredText: {
    fontSize: 13,
    color: "#ef4444",
    marginTop: 8,
    textAlign: "center",
  },
});
