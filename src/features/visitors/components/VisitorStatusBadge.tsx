import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Visitor } from "../types/visitors";
import { getStatusConfig } from "../utils/visitorHelpers";

interface VisitorStatusBadgeProps {
  status: Visitor["status"];
  size?: "small" | "medium" | "large";
}

export const VisitorStatusBadge: React.FC<VisitorStatusBadgeProps> = ({
  status,
  size = "medium",
}) => {
  const config = getStatusConfig(status);
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
        isSmall && styles.badgeSmall,
      ]}
    >
      <Text style={[styles.icon, isSmall && styles.iconSmall]}>
        {config.icon}
      </Text>
      <Text
        style={[
          styles.text,
          { color: config.color },
          isSmall && styles.textSmall,
        ]}
        numberOfLines={1}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  icon: {
    fontSize: 14,
  },
  iconSmall: {
    fontSize: 11,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
  },
  textSmall: {
    fontSize: 11,
  },
});
