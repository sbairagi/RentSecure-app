import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface VisitorLimitBannerProps {
  current: number;
  limit: number | string;
  onUpgrade?: () => void;
}

export const VisitorLimitBanner: React.FC<VisitorLimitBannerProps> = ({
  current,
  limit,
  onUpgrade,
}) => {
  const isUnlimited = limit === "unlimited";
  const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit;
  const isNearLimit = !isUnlimited && current >= limitNum;
  const isAtLimit = !isUnlimited && current >= limitNum;

  if (isUnlimited || (!isNearLimit && current === 0)) return null;

  const progress = isUnlimited ? 0 : Math.min((current / limitNum) * 100, 100);

  return (
    <View style={[styles.container, isAtLimit && styles.containerAtLimit]}>
      <View style={styles.header}>
        <MaterialIcons
          name={isAtLimit ? "error" : "info"}
          size={20}
          color={isAtLimit ? "#dc2626" : "#f59e0b"}
        />
        <Text style={[styles.title, isAtLimit && styles.titleAtLimit]}>
          {isAtLimit ? "Visitor Limit Reached" : `Visitor Limit: ${current}/${isUnlimited ? "∞" : limitNum}`}
        </Text>
      </View>
      {!isUnlimited && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: isAtLimit ? "#dc2626" : "#f59e0b" },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {current} of {limitNum} used
          </Text>
        </View>
      )}
      {isAtLimit && onUpgrade && (
        <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
          <Text style={styles.upgradeText}>Upgrade Plan</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fef3c7",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  containerAtLimit: {
    backgroundColor: "#fef2f2",
    borderColor: "#fee2e2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400e",
    flex: 1,
  },
  titleAtLimit: {
    color: "#991b1b",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "500",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  upgradeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
