import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { Visitor } from "../types/visitors";
import { VisitorStatusBadge } from "./VisitorStatusBadge";
import { getPurposeLabel, formatDateTime } from "../utils/visitorHelpers";

interface VisitorApprovalCardProps {
  visitor: Visitor;
  onApprove: (visitor: Visitor) => void;
  onReject: (visitor: Visitor) => void;
}

export const VisitorApprovalCard: React.FC<VisitorApprovalCardProps> = ({
  visitor,
  onApprove,
  onReject,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.visitorInfo}>
          <Text style={styles.visitorName}>{visitor.visitor_name}</Text>
          <Text style={styles.visitorMeta}>
            {visitor.phone_number} · {getPurposeLabel(visitor.purpose)}
          </Text>
          <Text style={styles.visitorMeta}>
            {visitor.renter_name} · {visitor.unit_identifier} · {visitor.building_name}
          </Text>
          <Text style={styles.visitorMeta}>
            📅 {visitor.visit_date} · 🕐 {formatDateTime(visitor.expected_arrival)}
          </Text>
          {visitor.vehicle_number && (
            <Text style={styles.visitorMeta}>🚗 {visitor.vehicle_number}</Text>
          )}
          {visitor.number_of_visitors > 1 && (
            <Text style={styles.visitorMeta}>👥 {visitor.number_of_visitors} visitors</Text>
          )}
        </View>
        <VisitorStatusBadge status={visitor.status} />
      </View>

      {visitor.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>{visitor.notes}</Text>
        </View>
      )}

      {visitor.rejection_reason && (
        <View style={styles.rejectionSection}>
          <Text style={styles.rejectionLabel}>Rejection Reason</Text>
          <Text style={styles.rejectionText}>{visitor.rejection_reason}</Text>
        </View>
      )}

      {visitor.status === "pending_approval" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => onReject(visitor)}
          >
            <MaterialIcons name="close" size={20} color="#ffffff" />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => onApprove(visitor)}
          >
            <MaterialIcons name="check" size={20} color="#ffffff" />
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  visitorInfo: {
    flex: 1,
    marginRight: 12,
  },
  visitorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  visitorMeta: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
  },
  notesSection: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 18,
  },
  rejectionSection: {
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  rejectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#dc2626",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 14,
    color: "#991b1b",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  rejectButton: {
    backgroundColor: "#ef4444",
  },
  approveButton: {
    backgroundColor: "#10b981",
  },
  rejectButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  approveButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
