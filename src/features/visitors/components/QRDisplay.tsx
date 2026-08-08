import React, { useCallback } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";

interface QRDisplayProps {
  visible: boolean;
  visitor: {
    visitor_name: string;
    renter_name: string;
    unit_identifier: string;
    qr_token: string | null;
    qr_expires_at: string | null;
    qr_used_count: number;
    qr_max_uses: number;
  } | null;
  onClose: () => void;
  onVerify?: () => void;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({
  visible,
  visitor,
  onClose,
  onVerify,
}) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!visible || !visitor) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Visitor QR Code</Text>
          <Text style={styles.visitorName}>{visitor.visitor_name}</Text>
          <Text style={styles.visitorInfo}>
            Visiting {visitor.renter_name} · {visitor.unit_identifier}
          </Text>

          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrIcon}>📱</Text>
              <Text style={styles.qrToken} selectable>
                {visitor.qr_token || "QR_TOKEN"}
              </Text>
              <Text style={styles.qrNote}>
                Show this code at the gate for verification
              </Text>
            </View>
          </View>

          {visitor.qr_expires_at && (
            <Text style={styles.expiry}>
              Expires:{" "}
              {new Date(visitor.qr_expires_at).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          )}

          <View style={styles.usageInfo}>
            <Text style={styles.usageText}>
              Uses: {visitor.qr_used_count}/{visitor.qr_max_uses}
            </Text>
          </View>

          {onVerify && (
            <TouchableOpacity style={styles.verifyButton} onPress={onVerify}>
              <Text style={styles.verifyText}>Verify QR at Gate</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 18,
    color: "#6b7280",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  visitorInfo: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
  },
  qrContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  qrIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  qrToken: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
  },
  qrNote: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
  expiry: {
    fontSize: 13,
    color: "#f59e0b",
    fontWeight: "500",
    marginBottom: 8,
  },
  usageInfo: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  usageText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  verifyButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  verifyText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
