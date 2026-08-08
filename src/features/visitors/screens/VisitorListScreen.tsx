import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { useVisitors } from "../hooks/useVisitors";
import { VisitorCard } from "../components/VisitorCard";
import { VisitorEmptyState } from "../components/VisitorEmptyState";
import { VisitorErrorState } from "../components/VisitorErrorState";
import { VisitorSearchBar } from "../components/VisitorSearchBar";
import { VisitorFilterSheet } from "../components/VisitorFilterSheet";
import { VisitorSortSheet } from "../components/VisitorSortSheet";
import { VisitorSkeleton } from "../components/VisitorSkeleton";
import type { Visitor } from "../types/visitors";
import { VISITOR_CONSTANTS } from "../constants/visitorConstants";

export const VisitorListScreen: React.FC<any> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [refreshing, setRefreshing] = useState(false);

  const { visitors, isLoading, isFetching, error, refresh } = useVisitors();

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitors</Text>
      </View>

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
      ) : visitors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <VisitorEmptyState
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
          {visitors.map((visitor) => (
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
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
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
