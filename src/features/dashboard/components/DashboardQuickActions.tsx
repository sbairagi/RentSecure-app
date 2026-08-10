import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

import type { PlanLimit } from '../types/dashboard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 4;

interface QuickAction {
  label: string;
  icon: string;
  path: string;
  color?: string;
  featureKey?: string;
}

interface DashboardQuickActionsProps {
  subscriptionExpired?: boolean;
  planLimits?: PlanLimit[];
  onUpgrade?: () => void;
  onActionPress?: (path: string) => void;
}

const ACTIONS: QuickAction[] = [
  { label: 'Add Building', icon: '🏢', path: '/(drawer)/(tabs)/buildings', color: '#2563EB', featureKey: 'max_buildings' },
  { label: 'Add Unit', icon: '🚪', path: '/(drawer)/(tabs)/units', color: '#059669', featureKey: 'max_units' },
  { label: 'Add Renter', icon: '👤', path: '/(drawer)/(tabs)/renters', color: '#D97706', featureKey: 'max_renters' },
  {
    label: 'Generate Agreement',
    icon: '📄',
    path: '/(drawer)/(tabs)/agreements',
    color: '#7C3AED',
    featureKey: 'rent_agreement_drafting',
  },
  { label: 'Collect Rent', icon: '💰', path: '/(drawer)/(tabs)/payments', color: '#DC2626' },
  { label: 'Invite Caretaker', icon: '🔑', path: '/(drawer)/(tabs)/caretakers', color: '#0891B2', featureKey: 'max_caretakers' },
  { label: 'View Reports', icon: '📊', path: '/(drawer)/(tabs)/reports', color: '#BE185D', featureKey: 'export_pdf_dossier' },
];

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  subscriptionExpired = false,
  planLimits = [],
  onUpgrade,
  onActionPress,
}) => {
  const theme = useTheme();

  const getLimitValue = (featureKey?: string): number | undefined => {
    if (!featureKey) return undefined;
    const limit = planLimits.find((l) => l.feature_key === featureKey);
    if (!limit) return undefined;
    const parsed = parseInt(limit.value, 10);
    if (!Number.isNaN(parsed)) return parsed;
    if (limit.value.toLowerCase() === 'unlimited') return Infinity;
    return undefined;
  };

  const handlePress = (action: QuickAction) => {
    if (subscriptionExpired && onUpgrade) {
      onUpgrade();
      return;
    }
    if (action.featureKey) {
      const limit = getLimitValue(action.featureKey);
      if (limit !== undefined && limit !== Infinity) {
        const usage = 0;
        if (usage >= limit && onUpgrade) {
          onUpgrade();
          return;
        }
      }
    }
    if (onActionPress) {
      onActionPress(action.path);
    }
  };

  return (
    <View style={styles.container}>
      {ACTIONS.map((action, index) => (
        <View key={index} style={styles.actionItem}>
          <IconButton
            icon={() => (
              <View style={[styles.iconWrapper, { backgroundColor: `${action.color}15` }]}>
                <Text style={styles.icon}>{action.icon}</Text>
              </View>
            )}
            size={48}
            onPress={() => handlePress(action)}
            style={styles.iconButton}
          />
          <Text
            variant="bodySmall"
            style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {action.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  actionItem: {
    width: CARD_WIDTH,
    alignItems: 'center',
    marginBottom: 8,
  },
  iconButton: {
    margin: 0,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
