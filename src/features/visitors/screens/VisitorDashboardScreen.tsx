import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";
import { useVisitors, useVisitorStats } from "../hooks/useVisitors";
import { VisitorCard } from "../components/VisitorCard";
import { VisitorEmptyState } from "../components/VisitorEmptyState";
import { VisitorErrorState } from "../components/VisitorErrorState";
import { VisitorSearchBar } from "../components/VisitorSearchBar";
import { VisitorFilterSheet } from "../components/VisitorFilterSheet";
import { VisitorSortSheet } from "../components/VisitorSortSheet";
import { VisitorSkeleton } from "../components/VisitorSkeleton";
import type { Visitor } from "../types/visitors";
import { VISITOR_CONSTANTS } from "../constants/visitorConstants";

export const VisitorDashboardScreen: React.FC<any> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [refreshing, setRefreshing] = useState(false);

  const { visitors, isLoading, isFetching, error, refresh } = useVisitors();
  const { stats, isLoading: statsLoading } = useVisitorStats();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } catch {
      showMessage({ message: "Failed to refresh", type: "danger" });
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const handleVisitorPress = (visitor: Visitor) => {
    navigation.navigate("VisitorDetails", { visitorId: visitor.id });
  };

  const statuses = [
    { label: "All", value: "" },
    ...Object.entries(VISITOR_CONSTANTS.STATUS_LABELS).map(([value, label]) => ({
      label,
      value,
    })),
  ];

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Visit Date (Latest)", value: "visit_date_desc" },
    { label: "Visit Date (Earliest)", value: "visit_date_asc" },
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Status", value: "status" },
  ];

  const displayVisitors = visitors;

  const statItems = stats
    ? [
        { label: "Pending", value: stats.pending_approval, color: "#f59e0b" },
        { label: "Approved", value: stats.approved, color: "#10b981" },
        { label: "Checked In", value: stats.checked_in, color: "#3b82f6" },
        { label: "Checked Out", value: stats.checked_out, color: "#8b5cf6" },
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitor Dashboard</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateVisitorRequest")}
        >
          <MaterialIcons name="add" size={20} color="#ffffff" />
          <Text style={styles.createButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      {stats && !statsLoading && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          <View style={styles.statsRow}>
            {statItems.map((item) => (
              <View key={item.label} style={styles.statCard}>
                <Text style={[styles.statValue, { color: item.color }]}>
                  {item.value}
                </Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <VisitorSearchBar
        value={search}
        onChange={setSearch}
        onFilterPress={() => setShowFilter(true)}
        onSortPress={() => setShowSort(true)}
      />

      {isLoading && !refreshing ? (
        <ScrollView style={styles.list}>
          {[1, 2, 3].map((i) => (
            <VisitorSkeleton key={i} />
          ))}
        </ScrollView>
      ) : error ? (
        <View style={styles.errorContainer}>
          <VisitorErrorState message={error} onRetry={onRefresh} />
        </View>
      ) : displayVisitors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <VisitorEmptyState
            title="No visitors yet"
            description="Create your first visitor request to get started."
            actionLabel="Create Visitor Request"
            onAction={() => navigation.navigate("CreateVisitorRequest")}
          />
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {displayVisitors.map((visitor) => (
            <VisitorCard
              key={visitor.id}
              visitor={visitor}
              onPress={handleVisitorPress}
            />
          ))}
          {isFetching && <VisitorSkeleton />}
        </ScrollView>
      )}

      <VisitorFilterSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        search={search}
        onSearchChange={setSearch}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statuses={statuses}
        onApply={() => setShowFilter(false)}
        onClear={() => {
          setSearch("");
          setSelectedStatus("");
        }}
      />

      <VisitorSortSheet
        visible={showSort}
        onClose={() => setShowSort(false)}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        sortOptions={sortOptions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  statsScroll: {
    maxHeight: 80,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
    marginTop: 2,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  errorContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
  },
});
