import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { Visitor } from "../types/visitors";
import { VisitorStatusBadge } from "./VisitorStatusBadge";
import { getPurposeLabel, formatDateTime, formatDate, formatDuration } from "../utils/visitorHelpers";

interface VisitorDetailHeaderProps {
  visitor: Visitor;
  onBack: () => void;
  onAction?: () => void;
  actionLabel?: string;
  showAction?: boolean;
}

export const VisitorDetailHeader: React.FC<VisitorDetailHeaderProps> = ({
  visitor,
  onBack,
  onAction,
  actionLabel,
  showAction = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Visitor Details</Text>
        {showAction && onAction && (
          <TouchableOpacity style={styles.actionButton} onPress={onAction}>
            <Text style={styles.actionText}>{actionLabel || "Action"}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {visitor.visitor_name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.visitorName}>{visitor.visitor_name}</Text>
            <Text style={styles.visitorPhone}>{visitor.phone_number}</Text>
            {visitor.email ? (
              <Text style={styles.visitorEmail}>{visitor.email}</Text>
            ) : null}
          </View>
          <VisitorStatusBadge status={visitor.status} />
        </View>

        <View style={styles.divider} />

        <View style={styles.infoGrid}>
          <InfoRow label="Purpose" value={getPurposeLabel(visitor.purpose)} />
          <InfoRow label="Building" value={visitor.building_name} />
          <InfoRow label="Unit" value={visitor.unit_identifier} />
          <InfoRow label="Renter" value={visitor.renter_name} />
          <InfoRow label="Visit Date" value={formatDate(visitor.visit_date)} />
          <InfoRow label="Expected Arrival" value={formatDateTime(visitor.expected_arrival)} />
          <InfoRow label="Expected Departure" value={formatDateTime(visitor.expected_departure)} />
          <InfoRow label="Group Size" value={`${visitor.number_of_visitors} visitor(s)`} />
          {visitor.vehicle_number ? (
            <InfoRow label="Vehicle" value={visitor.vehicle_number} />
          ) : null}
        </View>

        {visitor.check_in_time && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoGrid}>
              <InfoRow label="Checked In" value={formatDateTime(visitor.check_in_time)} />
              {visitor.verified_by_name && (
                <InfoRow label="Verified By" value={visitor.verified_by_name} />
              )}
              {visitor.vehicle_details ? (
                <InfoRow label="Vehicle at Entry" value={visitor.vehicle_details} />
              ) : null}
              {visitor.visit_duration_minutes != null && visitor.visit_duration_minutes > 0 && (
                <InfoRow label="Duration" value={formatDuration(visitor.visit_duration_minutes)} />
              )}
            </View>
          </>
        )}

        {visitor.check_out_time && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoGrid}>
              <InfoRow label="Checked Out" value={formatDateTime(visitor.check_out_time)} />
            </View>
          </>
        )}

        {visitor.notes ? (
          <>
            <View style={styles.divider} />
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{visitor.notes}</Text>
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  actionButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#374151",
  },
  headerInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  visitorPhone: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  visitorEmail: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 16,
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    flex: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  notesSection: {
    paddingVertical: 4,
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  notesText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});
