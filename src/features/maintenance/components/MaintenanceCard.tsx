import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MAINTENANCE_CONSTANTS } from '../constants';

interface MaintenanceCardProps {
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  unitName?: string;
  buildingName?: string;
  renterName?: string;
  assignedCaretakerName?: string;
  createdAt: string;
  onPress: () => void;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  title,
  description,
  category,
  priority,
  status,
  unitName,
  buildingName,
  renterName,
  assignedCaretakerName,
  createdAt,
  onPress,
}) => {
  const theme = useTheme();
  const statusConfig = MAINTENANCE_CONSTANTS.STATUS_CONFIG[status as keyof typeof MAINTENANCE_CONSTANTS.STATUS_CONFIG] || MAINTENANCE_CONSTANTS.STATUS_CONFIG.created;
  const priorityConfig = MAINTENANCE_CONSTANTS.PRIORITY_CONFIG[priority as keyof typeof MAINTENANCE_CONSTANTS.PRIORITY_CONFIG] || MAINTENANCE_CONSTANTS.PRIORITY_CONFIG.medium;
  const categoryLabel = MAINTENANCE_CONSTANTS.CATEGORY_LABELS[category as keyof typeof MAINTENANCE_CONSTANTS.CATEGORY_LABELS] || category;
  const categoryIcon = MAINTENANCE_CONSTANTS.CATEGORY_ICONS[category as keyof typeof MAINTENANCE_CONSTANTS.CATEGORY_ICONS] || '📋';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityConfig.backgroundColor }]}>
            <Text style={[styles.priorityText, { color: priorityConfig.color }]}>
              {priorityConfig.label}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>
      <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
        {description}
      </Text>
      <View style={styles.metaRow}>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {categoryIcon} {categoryLabel}
        </Text>
        {unitName && (
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            Unit: {unitName}
          </Text>
        )}
        {buildingName && (
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {buildingName}
          </Text>
        )}
      </View>
      {renterName && (
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          Renter: {renterName}
        </Text>
      )}
      {assignedCaretakerName && (
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          Caretaker: {assignedCaretakerName}
        </Text>
      )}
      <Text style={[styles.date, { color: theme.textSecondary }]}>
        {new Date(createdAt).toLocaleDateString()}
      </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
});
