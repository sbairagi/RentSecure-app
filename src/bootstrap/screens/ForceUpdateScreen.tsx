import { useAppStore } from '@/bootstrap/stores/appStore';
import { useEffect } from 'react';
import {
  Animated,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ForceUpdateScreen() {
  const appVersion = useAppStore((s) => s.appVersion);
  const backendVersion = useAppStore((s) => s.backendVersion);
  // Animated.Value is designed to be created in render for React Native Animated API
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleUpdate = async () => {
    const storeUrl = useAppStore.getState().maintenanceMessage || 'https://apps.apple.com';
    try {
      await Linking.openURL(storeUrl);
    } catch {
      console.error('Failed to open store URL');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.icon}>⬆️</Text>
      </Animated.View>

      <Text style={styles.title}>Update Required</Text>
      <Text style={styles.message}>
        A new version of SecureNest is available. Please update to the latest version to continue
        using the app.
      </Text>

      <View style={styles.versionContainer}>
        <View style={styles.versionBadge}>
          <Text style={styles.versionLabel}>Current</Text>
          <Text style={styles.versionText}>v{appVersion || '1.0.0'}</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
        <View style={[styles.versionBadge, styles.versionBadgeNew]}>
          <Text style={styles.versionLabel}>Latest</Text>
          <Text style={styles.versionTextNew}>v{backendVersion || '1.0.0'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} activeOpacity={0.8}>
        <Text style={styles.updateButtonText}>Update Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
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
    color: '#166534',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#15803d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  versionBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'center',
  },
  versionBadgeNew: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  versionLabel: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  versionText: {
    fontSize: 16,
    color: '#166534',
    fontWeight: '700',
  },
  versionTextNew: {
    fontSize: 16,
    color: '#15803d',
    fontWeight: '700',
  },
  arrow: {
    fontSize: 20,
    color: '#22c55e',
    marginHorizontal: 16,
    fontWeight: '300',
  },
  updateButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
