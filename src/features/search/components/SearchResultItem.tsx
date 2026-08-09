import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { showMessage } from 'react-native-flash-message';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';
import { buildNavigationTarget, formatRelativeTime, getResourceTypeBadgeStyle, getResourceTypeIcon, isDeepLinkAvailable } from '../utils/search.utils';
import type { SearchResult } from '../types/search.types';

interface SearchResultItemProps {
  result: SearchResult;
  onAgreementsPress?: () => void;
}

export function SearchResultItem({ result, onAgreementsPress }: SearchResultItemProps) {
  const router = useRouter();
  const resourceConfig = SEARCH_CONSTANTS.RESOURCE_TYPES[result.resource_type];
  const badgeStyle = getResourceTypeBadgeStyle(result.resource_type);
  const hasDeepLink = isDeepLinkAvailable(result);
  const navigationTarget = buildNavigationTarget(result);

  const handlePress = () => {
    if (result.resource_type === 'agreements') {
      onAgreementsPress?.();
      showMessage({
        message: 'Open Agreements to view this record',
        type: 'info',
      });
      return;
    }

    if (result.resource_type === 'rent_records') {
      showMessage({
        message: 'Open Payments to view this record',
        type: 'info',
      });
      router.push('/(drawer)/(tabs)/payments');
      return;
    }

    if (navigationTarget) {
      router.push(navigationTarget as any);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      accessibilityLabel={`${result.title}, ${result.subtitle}, ${result.status}`}
      accessibilityRole="button"
      accessibilityHint={hasDeepLink ? 'Tap to view details' : 'Tap to view related section'}
      activeOpacity={0.7}
      testID={`search-result-${result.resource_type}-${result.id}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${resourceConfig.color}15` }]}>
        <Text style={styles.icon}>{resourceConfig.icon}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {result.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.color }]}>
              {resourceConfig.label}
            </Text>
          </View>
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>
          {result.subtitle}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.statusBadge, { backgroundColor: `${badgeStyle.color}15` }]}>
            <Text style={[styles.statusText, { color: badgeStyle.color }]}>
              {result.status}
            </Text>
          </View>
          <Text style={styles.lastUpdated}>
            {formatRelativeTime(result.last_updated)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 88,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  lastUpdated: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
