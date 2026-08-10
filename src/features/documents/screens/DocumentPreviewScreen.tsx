import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { Image } from 'expo-image';
import { useDocumentsStore } from '../store/documentsStore';
import { API_CONFIG } from '@/services/api/endpoints';
import { secureStorage } from '@/services/storage/secureStorage';
import { Button } from 'react-native-paper';

export default function DocumentPreviewScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | 'unsupported' | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [webViewUri, setWebViewUri] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      try {
        const doc = useDocumentsStore.getState().documents.find((d) => d.id === Number(id));
        if (!doc) {
          setError('Document not found');
          setIsLoading(false);
          return;
        }

        const filePath = doc.document;
        const isImage = true;
        const isPdf = false;

        if (isImage) {
          setPreviewType('image');
          setPreviewUri(filePath);
        } else if (isPdf) {
          setPreviewType('pdf');
          const token = await secureStorage.getAccessToken();
          const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
          const webUri = `${baseUrl}${filePath}${filePath.includes('?') ? '&' : '?'}access_token=${token}`;
          setWebViewUri(webUri);
        } else {
          setPreviewType('unsupported');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Preview</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text style={[styles.loadingText, { color: theme.subText }]}>Loading preview...</Text>
        </View>
      </View>
    );
  }

  if (error || !previewType || previewType === 'unsupported') {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Preview</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.error}>
          <Text style={[styles.errorText, { color: theme.subText }]}>
            {error || 'Preview not available for this file type.'}
          </Text>
          <Button mode="contained" onPress={() => router.back()} style={styles.retryButton}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Preview</Text>
        <View style={{ width: 50 }} />
      </View>
      {previewType === 'image' && previewUri ? (
        <Image
          source={{ uri: previewUri }}
          style={styles.image}
          contentFit="contain"
          onError={() => setError('Failed to load image')}
        />
      ) : (
        previewType === 'pdf' &&
        webViewUri && (
          <WebView
            source={{ uri: webViewUri }}
            style={styles.webview}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" />
              </View>
            )}
            javaScriptEnabled={false}
            domStorageEnabled={false}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  back: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: '#4f46e5',
  },
  image: {
    flex: 1,
  },
  webview: {
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
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
