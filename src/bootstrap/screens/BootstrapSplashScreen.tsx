import { useAppStore } from '@/bootstrap/stores/appStore';
import { useEffect } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { BOOTSTRAP_CONSTANTS, BOOTSTRAP_PHASES } from '../constants/bootstrap';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BootstrapSplashScreen() {
  const currentPhase = useAppStore((s) => s.currentPhase);
  const error = useAppStore((s) => s.error);
  const errorMessage = useAppStore((s) => s.errorMessage);
  const isOnline = useAppStore((s) => s.isOnline);
  const retryCount = useAppStore((s) => s.retryCount);

  const logoScale = new Animated.Value(0.8);
  const logoOpacity = new Animated.Value(0);
  const progressOpacity = new Animated.Value(0);
  const statusOpacity = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);

  // Animated values are intentionally recreated each render - they are handled by
  // the React Native Animated API and do not need to be persisted in refs.
  useEffect(() => {
    const animateIn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.delay(400),
        Animated.timing(progressOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(statusOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
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
    };

    animateIn();
  }, []);

  const getProgress = (): number => {
    if (currentPhase === 'completed') return 1;
    if (currentPhase === 'failed') return 0;
    if (currentPhase === 'idle') return 0;
    const phases = BOOTSTRAP_CONSTANTS.PHASES_ORDER as readonly string[];
    const currentIndex = phases.includes(currentPhase) ? phases.indexOf(currentPhase) : -1;
    return Math.max(0, Math.min(1, currentIndex / (phases.length - 1)));
  };

  const getStatusText = (): string => {
    if (error) return errorMessage || 'Something went wrong';
    const phaseInfo = BOOTSTRAP_PHASES[currentPhase];
    if (phaseInfo) return phaseInfo.description;
    return 'Initializing...';
  };

  const progress = getProgress();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }],
            opacity: logoOpacity,
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🏠</Text>
        </View>
        <Text style={styles.appName}>SecureNest</Text>
        <Text style={styles.tagline}>Smart Property Management</Text>
      </Animated.View>

      <Animated.View style={[styles.progressContainer, { opacity: progressOpacity }]}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
        <View style={styles.progressDots}>
          {BOOTSTRAP_CONSTANTS.PHASES_ORDER.map((phaseName, index) => {
            const phases = BOOTSTRAP_CONSTANTS.PHASES_ORDER as readonly string[];
            const currentInOrder = phases.includes(currentPhase)
              ? phases.indexOf(currentPhase)
              : -1;
            const isActive = currentInOrder >= 0 && index <= currentInOrder;
            const isCurrent = currentPhase === phaseName;
            return (
              <View
                key={index}
                style={[styles.dot, isActive && styles.dotActive, isCurrent && styles.dotCurrent]}
              />
            );
          })}
        </View>
      </Animated.View>

      <Animated.View style={[styles.statusContainer, { opacity: statusOpacity }]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        {error && retryCount > 0 && (
          <Text style={styles.retryText}>
            Retry {retryCount}/{BOOTSTRAP_CONSTANTS.RETRY.MAX_RETRIES}
          </Text>
        )}
      </Animated.View>

      {!isOnline && !error && (
        <Animated.View style={[styles.offlineBadge, { opacity: statusOpacity }]}>
          <Text style={styles.offlineText}>Offline Mode</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoEmoji: {
    fontSize: 56,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#c7d2fe',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: SCREEN_WIDTH * 0.7,
    alignItems: 'center',
    marginBottom: 32,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dotCurrent: {
    backgroundColor: '#ffffff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    color: '#e0e7ff',
    fontWeight: '500',
    textAlign: 'center',
  },
  retryText: {
    fontSize: 12,
    color: '#fbbf24',
    marginTop: 8,
    fontWeight: '500',
  },
  offlineBadge: {
    position: 'absolute',
    top: 60,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
