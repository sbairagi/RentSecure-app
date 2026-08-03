import { Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from 'react-i18next';

export default function TabTwoScreen() {
  const { t } = useTranslation();
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={{
        ...safeAreaInsets,
        bottom: safeAreaInsets.bottom + 80 + Spacing.lg,
      }}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">{t('dashboard.title')}</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            {t('common.somethingWentWrong')}
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView style={styles.linkButton}>
                <ThemedText type="link">Expo documentation</ThemedText>
                <Text style={{ color: theme.text, fontSize: 12 }}>↗</Text>
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title={t('common.learnMore')}>
            <ThemedText type="small">{t('auth.loginButton')}</ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText type="linkPrimary">{t('common.learnMore')}</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title={t('settings.title')}>
            <ThemedView type="backgroundElement" style={styles.collapsibleContent}>
              <ThemedText type="small">{t('settings.language')}</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title={t('profile.title')}>
            <ThemedText type="small">{t('common.edit')}</ThemedText>
          </Collapsible>

          <Collapsible title={t('settings.theme')}>
            <ThemedText type="small">{t('common.success')}</ThemedText>
          </Collapsible>

          <Collapsible title={t('dashboard.recentActivity')}>
            <ThemedText type="small">{t('common.loading')}</ThemedText>
          </Collapsible>
        </ThemedView>
        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.md,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxxl,
  },
  centerText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  collapsibleContent: {
    alignItems: 'center',
  },
});
