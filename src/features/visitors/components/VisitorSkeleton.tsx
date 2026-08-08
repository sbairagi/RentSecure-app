import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "@/design-system/loaders";

export const VisitorSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={styles.headerText}>
          <Skeleton width={140} height={16} borderRadius={4} />
          <Skeleton width={200} height={13} borderRadius={4} style={{ marginTop: 6 }} />
        </View>
        <Skeleton width={100} height={28} borderRadius={14} />
      </View>
      <View style={styles.details}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.detailRow}>
            <Skeleton width={i % 2 === 0 ? 70 : 100} height={14} borderRadius={4} />
            <Skeleton width={i % 2 === 0 ? 100 : 70} height={14} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: "45%",
    marginBottom: 4,
    gap: 8,
  },
});
