import { useAppStore } from '@/bootstrap/stores/appStore';
import { useEffect } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

export default function MaintenanceScreen() {
  const maintenanceMessage = useAppStore((s) => s.maintenanceMessage);
  // Animated.Value is designed to be created in render for React Native Animated API
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.icon}>🔧</Text>
      </Animated.View>

      <Text style={styles.title}>Under Maintenance</Text>
      <Text style={styles.message}>
        {maintenanceMessage ||
          "We're making improvements to give you a better experience. Please check back soon."}
      </Text>

      <View style={styles.statusContainer}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Our team is working on it</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...Platform.select({
      ios: {
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#a16207',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
  },
});
