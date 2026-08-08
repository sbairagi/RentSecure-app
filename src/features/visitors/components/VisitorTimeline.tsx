import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import type { VisitorHistoryEntry } from "../types/visitors";
import { getHistoryIcon } from "../utils/visitorHelpers";

interface VisitorTimelineProps {
  history: VisitorHistoryEntry[];
  isLoading?: boolean;
}

export const VisitorTimeline: React.FC<VisitorTimelineProps> = ({
  history,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.loadingItem}>
            <View style={styles.loadingIcon} />
            <View style={styles.loadingContent}>
              <View style={styles.loadingLine} />
              <View style={[styles.loadingLine, { width: 120 }]} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>No history yet</Text>
        <Text style={styles.emptyDescription}>
          Activity history will appear here as events occur.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: VisitorHistoryEntry; index: number }) => (
    <View style={styles.item}>
      <View style={styles.timelineColumn}>
        <View style={[styles.iconContainer, index === history.length - 1 && styles.lastIcon]}>
          <Text style={styles.icon}>{getHistoryIcon(item.action)}</Text>
        </View>
        {index < history.length - 1 && <View style={styles.line} />}
      </View>
      <View style={styles.content}>
        <Text style={styles.actionText}>{item.action_display || item.action}</Text>
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <Text style={styles.timestamp}>
          {item.created_at ? new Date(item.created_at).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) : ""}
        </Text>
        {item.performed_by_name && (
          <Text style={styles.performedBy}>by {item.performed_by_name}</Text>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={history}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineColumn: {
    alignItems: "center",
    width: 40,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  lastIcon: {
    backgroundColor: "#dbeafe",
  },
  icon: {
    fontSize: 16,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  performedBy: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
    fontStyle: "italic",
  },
  loadingItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  loadingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    marginRight: 12,
  },
  loadingContent: {
    flex: 1,
    gap: 6,
  },
  loadingLine: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: 160,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 20,
  },
});
