import { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface DividerProps {
  style?: ViewStyle;
  color?: string;
}

export const Divider: FC<DividerProps> = ({ style }) => {
  return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E5E7EB',
  },
});
