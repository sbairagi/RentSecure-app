import { useAuthStore } from '@/store/authStore';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type UpdateType = 'required' | 'optional' | null;

interface VersionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function VersionGuard({ children, fallback }: VersionGuardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const [updateType, setUpdateType] = useState<UpdateType>(null);
  const [latestVersion, setLatestVersion] = useState<string>('');

  const currentVersion = Constants.expoConfig?.version || '1.0.0';

  const compareVersions = (current: string, latest: string): number => {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const latestPart = latestParts[i] || 0;
      if (latestPart > currentPart) return -1;
      if (latestPart < currentPart) return 1;
    }
    return 0;
  };

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/app/version/`,
          { headers: { Accept: 'application/json' } }
        );

        if (response.ok) {
          const data = await response.json();
          const comparison = compareVersions(currentVersion, data.latestVersion);

          if (data.isUpdateRequired && comparison < 0) {
            setUpdateType('required');
            setLatestVersion(data.latestVersion);
          } else if (data.isOptional && comparison < 0) {
            setUpdateType('optional');
            setLatestVersion(data.latestVersion);
          }
        }
      } catch {
        // Continue even if version check fails
      } finally {
        setChecking(false);
      }
    };

    checkVersion();
  }, [currentVersion]);

  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (updateType === 'required' && isAuthenticated) {
    return (
      fallback || (
        <View style={styles.updateContainer}>
          <Text style={styles.updateTitle}>Update Required</Text>
          <Text style={styles.updateText}>
            A new version ({latestVersion}) is required. Please update to continue.
          </Text>
        </View>
      )
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  updateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  updateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
