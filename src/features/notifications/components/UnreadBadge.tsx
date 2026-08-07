import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const UnreadBadge: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
      <Text style={styles.text}>NEW</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: 28,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  text: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
