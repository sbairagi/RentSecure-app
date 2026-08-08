import React from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface VisitorSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterPress?: () => void;
  onSortPress?: () => void;
  showFilter?: boolean;
  showSort?: boolean;
}

export const VisitorSearchBar: React.FC<VisitorSearchBarProps> = ({
  value,
  onChange,
  onFilterPress,
  onSortPress,
  showFilter = true,
  showSort = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.input}
          placeholder="Search visitors..."
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")}>
            <MaterialIcons name="clear" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.actions}>
        {showFilter && onFilterPress && (
          <TouchableOpacity style={styles.iconButton} onPress={onFilterPress}>
            <MaterialIcons name="filter-list" size={22} color="#6b7280" />
          </TouchableOpacity>
        )}
        {showSort && onSortPress && (
          <TouchableOpacity style={styles.iconButton} onPress={onSortPress}>
            <MaterialIcons name="sort" size={22} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
});
