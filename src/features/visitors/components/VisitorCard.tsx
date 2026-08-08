import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { Visitor } from "../types/visitors";
import { getStatusConfig, getPurposeLabel, formatDateTime, formatDuration } from "../utils/visitorHelpers";

interface VisitorCardProps {
  visitor: Visitor;
  onPress: (visitor: Visitor) => void;
  showActions?: boolean;
}

export const VisitorCard: React.FC<VisitorCardProps> = ({ visitor, onPress, showActions = true }) => {
  const statusConfig = getStatusConfig(visitor.status);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(visitor)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: statusConfig.backgroundColor }]}>
          <Text style={styles.avatarText}>
            {visitor.visitor_name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.visitorName} numberOfLines={1}>
            {visitor.visitor_name}
          </Text>
          <Text style={styles.renterInfo} numberOfLines={1}>
            Visiting {visitor.renter_name} · {visitor.unit_identifier}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.icon} {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Purpose</Text>
          <Text style={styles.detailValue}>{getPurposeLabel(visitor.purpose)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Visit Date</Text>
          <Text style={styles.detailValue}>{visitor.visit_date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Arrival</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {formatDateTime(visitor.expected_arrival)}
          </Text>
        </View>
        {visitor.check_in_time && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Checked In</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {formatDateTime(visitor.check_in_time)}
            </Text>
          </View>
        )}
        {visitor.check_out_time && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Checked Out</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {formatDateTime(visitor.check_out_time)}
            </Text>
          </View>
        )}
        {visitor.visit_duration_minutes != null && visitor.visit_duration_minutes > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{formatDuration(visitor.visit_duration_minutes)}</Text>
          </View>
        )}
        {visitor.vehicle_number && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vehicle</Text>
            <Text style={styles.detailValue}>{visitor.vehicle_number}</Text>
          </View>
        )}
        {visitor.number_of_visitors > 1 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Group Size</Text>
            <Text style={styles.detailValue}>{visitor.number_of_visitors} visitors</Text>
          </View>
        )}
      </View>

      {showActions && visitor.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText} numberOfLines={2}>
            {visitor.notes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  renterInfo: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "45%",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: "#9ca3af",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
});
