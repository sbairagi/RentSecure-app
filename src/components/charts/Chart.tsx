import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChartProps {
  data: { label: string; value: number; color?: string }[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({ data, type = 'bar', height = 200 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.placeholder}>Chart: {type}</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <Text style={styles.label}>{item.label}</Text>
          <View
            style={[
              styles.bar,
              {
                width: `${(item.value / Math.max(...data.map((d) => d.value))) * 100}%`,
                backgroundColor: item.color || '#2563EB',
              },
            ]}
          />
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  placeholder: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: 80,
    fontSize: 12,
    color: '#6B7280',
  },
  bar: {
    height: 20,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    width: 40,
    textAlign: 'right',
  },
});
