import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors } from '../tokens';

export interface TabsProps {
  tabs: { key: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
  onChange?: (key: string) => void;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, onChange, style }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key || '');
  const theme = useDesignSystemTheme();

  const handlePress = (key: string) => {
    setActiveTab(key);
    onChange?.(key);
  };

  const activeContent = tabs.find((tab) => tab.key === activeTab)?.content;

  return (
    <View style={style}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable key={tab.key} onPress={() => handlePress(tab.key)} style={styles.tab}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab.key ? theme.colors.primary[600] : theme.colors.neutral[500],
                },
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.key && (
              <View style={[styles.indicator, { backgroundColor: theme.colors.primary[600] }]} />
            )}
          </Pressable>
        ))}
      </View>
      <View style={styles.content}>{activeContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3,
    borderRadius: 2,
  },
  content: {
    paddingTop: 16,
  },
});
