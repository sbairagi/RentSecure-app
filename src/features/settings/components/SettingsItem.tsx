import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import type { SettingsItemData } from '../types';

export function SettingsItem(props: SettingsItemData) {
  const {
    label,
    description,
    icon,
    type,
    value,
    options,
    onPress,
    onToggle,
    disabled = false,
    loading = false,
  } = props;
  const theme = useTheme();
  const isDanger = type === 'danger';
  const isToggle = type === 'toggle';

  const content = (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View style={styles.leftContent}>
        {icon ? (
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: isDanger ? theme.colors.errorContainer : theme.colors.primaryContainer },
            ]}
          >
            <IconButton
              icon={icon}
              size={20}
              iconColor={isDanger ? theme.colors.onErrorContainer : theme.colors.onPrimaryContainer}
              style={styles.icon}
            />
          </View>
        ) : null}
        <View style={styles.textContent}>
          <Text
            style={[
              styles.label,
              {
                color: isDanger ? theme.colors.error : theme.colors.onSurface,
              },
            ]}
          >
            {label}
          </Text>
          {description ? (
            <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
              {description}
            </Text>
          ) : null}
          {type === 'select' && options && value ? (
            <Text style={[styles.value, { color: theme.colors.primary }]}>
              {options.find((o) => o.value === value)?.label || value}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.rightContent}>
        {isToggle && onToggle ? (
          <Switch
            value={!!value}
            onValueChange={onToggle}
            disabled={disabled || loading}
          />
        ) : null}
        {type === 'navigate' && onPress ? (
          <IconButton
            icon="chevron-right"
            size={24}
            iconColor={theme.colors.onSurfaceVariant}
            disabled={disabled}
          />
        ) : null}
      </View>
    </View>
  );

  if (type === 'navigate' && onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.pressable,
          { opacity: pressed ? 0.7 : 1, backgroundColor: theme.colors.surface },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.staticContainer, { backgroundColor: theme.colors.surface }]}>{content}</View>;
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  staticContainer: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  disabled: {
    opacity: 0.5,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    margin: 0,
  },
  textContent: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
  value: {
    fontSize: 14,
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
});
