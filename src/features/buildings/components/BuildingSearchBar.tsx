import { SearchInput } from '@/design-system/inputs/SearchInput';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface BuildingSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const BuildingSearchBar: React.FC<BuildingSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search buildings...',
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <SearchInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        containerStyle={{ backgroundColor: theme.backgroundElement }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
