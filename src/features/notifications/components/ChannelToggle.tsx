import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch, Text, useTheme } from 'react-native-paper';
import type { NotificationChannel } from '../types';
import { CHANNEL_CONFIG } from '../constants/notificationTypes';

interface ChannelToggleProps {
  channel: NotificationChannel;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export const ChannelToggle: React.FC<ChannelToggleProps> = ({
  channel,
  enabled,
  onToggle,
  disabled = false,
}) => {
  const theme = useTheme();
  const config = CHANNEL_CONFIG[channel];

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.outlineVariant }]}>
      <View style={styles.info}>
        <Text style={styles.icon}>{config.icon}</Text>
        <View>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>{config.label}</Text>
          <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>
      <Switch value={enabled} onValueChange={onToggle} disabled={disabled} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  icon: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
});
