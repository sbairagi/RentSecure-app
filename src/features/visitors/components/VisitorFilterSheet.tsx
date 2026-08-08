import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface VisitorFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  search: string;
  onSearchChange: (search: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  statuses: { label: string; value: string }[];
  onApply: () => void;
  onClear: () => void;
}

export const VisitorFilterSheet: React.FC<VisitorFilterSheetProps> = ({
  visible,
  onClose,
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  statuses,
  onApply,
  onClear,
}) => {
  return (
    <View style={[styles.overlay, visible && styles.overlayVisible]} onTouchStart={onClose}>
      <View style={[styles.sheet, visible && styles.sheetVisible]} onTouchStart={(e) => e.stopPropagation()}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Search</Text>
          <TextInput
            style={styles.input}
            placeholder="Search by name, phone, vehicle..."
            value={search}
            onChangeText={onSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusGrid}>
            {statuses.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={[
                  styles.statusChip,
                  selectedStatus === status.value && styles.statusChipActive,
                ]}
                onPress={() => onStatusChange(status.value)}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    selectedStatus === status.value && styles.statusChipTextActive,
                  ]}
                >
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={onApply}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    opacity: 0,
    pointerEvents: "none",
  },
  overlayVisible: {
    opacity: 1,
    pointerEvents: "auto",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    transform: [{ translateY: "100%" }],
  },
  sheetVisible: {
    transform: [{ translateY: 0 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#f9fafb",
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  statusChipActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  statusChipText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  statusChipTextActive: {
    color: "#ffffff",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  clearText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b7280",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#3b82f6",
    alignItems: "center",
  },
  applyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
});
