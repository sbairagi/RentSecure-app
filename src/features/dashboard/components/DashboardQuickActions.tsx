import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 4;

interface QuickAction {
  label: string;
  icon: string;
  path: string;
  color?: string;
}

interface DashboardQuickActionsProps {
  onActionPress?: (path: string) => void;
}

const ACTIONS: QuickAction[] = [
  { label: 'Add Building', icon: '🏢', path: '/(drawer)/(tabs)/properties', color: '#2563EB' },
  { label: 'Add Unit', icon: '🚪', path: '/(drawer)/(tabs)/properties', color: '#059669' },
  { label: 'Add Renter', icon: '👤', path: '/(drawer)/(tabs)/properties', color: '#D97706' },
  {
    label: 'Generate Agreement',
    icon: '📄',
    path: '/(drawer)/(tabs)/agreements',
    color: '#7C3AED',
  },
  { label: 'Collect Rent', icon: '💰', path: '/(drawer)/(tabs)/payments', color: '#DC2626' },
  { label: 'Invite Caretaker', icon: '🔑', path: '/(drawer)/(tabs)/caretakers', color: '#0891B2' },
  { label: 'View Reports', icon: '📊', path: '/(drawer)/(tabs)/reports', color: '#BE185D' },
];

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({ onActionPress }) => {
  const theme = useTheme();

  const handlePress = (path: string) => {
    if (onActionPress) {
      onActionPress(path);
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
            onPress={() => handlePress(action.path)}
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
