import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Searchbar, useTheme } from 'react-native-paper';

interface NotificationSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterPress: () => void;
}

export const NotificationSearchBar: React.FC<NotificationSearchBarProps> = ({
  value,
  onChange,
  onFilterPress,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search notifications..."
        onChangeText={onChange}
        value={value}
        style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
        iconColor={theme.colors.onSurfaceVariant}
        inputStyle={{ color: theme.colors.onSurface }}
        onSubmitEditing={() => {}}
      />
      <IconButton
        icon="tune-variant"
        size={24}
        onPress={onFilterPress}
        iconColor={theme.colors.onSurfaceVariant}
        style={styles.filterButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  searchbar: {
    flex: 1,
    elevation: 0,
    borderRadius: 12,
  },
  filterButton: {
    margin: 0,
  },
});
