import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface VisitorSortSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  sortOptions: { label: string; value: string }[];
}

export const VisitorSortSheet: React.FC<VisitorSortSheetProps> = ({
  visible,
  onClose,
  selectedSort,
  onSortChange,
  sortOptions,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay} onTouchStart={onClose}>
        <View style={styles.sheet} onTouchStart={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Sort By</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  selectedSort === option.value && styles.optionActive,
                ]}
                onPress={() => {
                  onSortChange(option.value);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedSort === option.value && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {selectedSort === option.value && (
                  <MaterialIcons name="check" size={20} color="#3b82f6" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  optionActive: {
    backgroundColor: "#eff6ff",
  },
  optionText: {
    fontSize: 15,
    color: "#374151",
  },
  optionTextActive: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
