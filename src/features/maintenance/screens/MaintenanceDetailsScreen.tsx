import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMaintenanceDetail } from '../hooks';
import { MaintenanceStatusBadge, MaintenancePriorityBadge, MaintenanceCategoryBadge, MaintenanceTimeline, MaintenanceCommentItem } from '../components';
import type { MaintenanceCommentPayload, MaintenanceExpensePayload } from '../types';

export default function MaintenanceDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { request, isLoading, error, refresh: _refresh, updateStatus, assignCaretaker: _assignCaretaker, assignVendor: _assignVendor, addComment, addExpense } = useMaintenanceDetail(Number(params.id));
  const [_showStatusSheet, setShowStatusSheet] = useState(false);
  const [_showCommentSheet, setShowCommentSheet] = useState(false);
  const [_showExpenseSheet, setShowExpenseSheet] = useState(false);
  const [commentText, setCommentText] = useState('');

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['maintenance:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !request) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['maintenance:read']}>
          <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.errorText, { color: theme.text }]}>Request not found</Text>
            {error && <Text style={[styles.errorDetail, { color: theme.textSecondary }]}>{error}</Text>}
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const _handleStatusUpdate = (status: string, resolutionNotes?: string) => {
    updateStatus({ id: request.id, data: { status, resolution_notes: resolutionNotes } });
    setShowStatusSheet(false);
  };

  const _handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment({ id: request.id, data: { text: commentText } as MaintenanceCommentPayload });
    setCommentText('');
    setShowCommentSheet(false);
  };

  const _handleAddExpense = (data: MaintenanceExpensePayload) => {
    addExpense({ id: request.id, data });
    setShowExpenseSheet(false);
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['maintenance:read']}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>{request.title}</Text>
            <View style={styles.badgesRow}>
              <MaintenanceCategoryBadge category={request.category} />
              <MaintenancePriorityBadge priority={request.priority} />
              <MaintenanceStatusBadge status={request.status} />
            </View>
            <Text style={[styles.description, { color: theme.textSecondary }]}>{request.description}</Text>
            <View style={styles.metaContainer}>
              {request.building_name && (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>Building: {request.building_name}</Text>
              )}
              {request.unit_name && (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>Unit: {request.unit_name}</Text>
              )}
              {request.renter_name && (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>Renter: {request.renter_name}</Text>
              )}
              {request.assigned_caretaker_name && (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>Caretaker: {request.assigned_caretaker_name}</Text>
              )}
              {request.assigned_vendor_name && (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>Vendor: {request.assigned_vendor_name}</Text>
              )}
              {request.preferred_date && (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>Preferred: {request.preferred_date}</Text>
              )}
              {request.notes && (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>Notes: {request.notes}</Text>
              )}
              {request.resolution_notes && (
                <Text style={[styles.meta, { color: theme.textSecondary }]}>Resolution: {request.resolution_notes}</Text>
              )}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primary }]} onPress={() => setShowStatusSheet(true)}>
                <Text style={styles.actionText}>Update Status</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primary }]} onPress={() => router.push(`/(drawer)/(tabs)/maintenance/${request.id}/assign-caretaker`)}>
                <Text style={styles.actionText}>Assign Caretaker</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primary }]} onPress={() => router.push(`/(drawer)/(tabs)/maintenance/${request.id}/assign-vendor`)}>
                <Text style={styles.actionText}>Assign Vendor</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Timeline</Text>
            <MaintenanceTimeline activities={[]} />
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Comments</Text>
            <MaintenanceCommentItem authorName="You" text="Sample comment" createdAt={new Date().toISOString()} />
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={() => setShowCommentSheet(true)}>
              <Text style={styles.addButtonText}>Add Comment</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Expenses</Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={() => setShowExpenseSheet(true)}>
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 18,
    fontWeight: '600',
  },
  errorDetail: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    paddingHorizontal: 32,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    gap: 4,
    marginBottom: 16,
  },
  meta: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
