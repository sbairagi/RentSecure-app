import React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import type { DashboardResponse } from '../types/dashboard';

interface DashboardRecentActivityProps {
  data: DashboardResponse['recent'] | null;
  isLoading?: boolean;
}

type SectionItem = {
  title: string;
  description: string;
  timestamp: string;
  avatar?: string;
  status?: string;
};

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
  data,
  isLoading = false,
}) => {
  const theme = useTheme();

  if (isLoading || !data) {
    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Recent Activity
        </Text>
        <Text style={{ color: theme.colors.onSurfaceVariant, paddingHorizontal: 16 }}>
          Loading...
        </Text>
      </View>
    );
  }

  const rentPaymentSections: SectionItem[] = data.rent_payments
    .slice(0, 3)
    .map((payment: DashboardResponse['recent']['rent_payments'][0]) => ({
      title: `${payment.renter_name} - ${payment.unit_name}`,
      description: `₹${payment.amount} paid via ${payment.payment_method}`,
      timestamp: new Date(payment.due_date).toLocaleDateString(),
      status: payment.status,
      avatar: payment.renter_name.charAt(0),
    }));

  const tenantSections: SectionItem[] = data.tenants
    .slice(0, 3)
    .map((tenant: DashboardResponse['recent']['tenants'][0]) => ({
      title: tenant.name,
      description: `${tenant.unit_name}, ${tenant.building_name}`,
      timestamp: new Date(tenant.start_date).toLocaleDateString(),
      status: tenant.status,
      avatar: tenant.name.charAt(0),
    }));

  const agreementSections: SectionItem[] = data.agreements
    .slice(0, 3)
    .map((agreement: DashboardResponse['recent']['agreements'][0]) => ({
      title: `${agreement.renter_name} - ${agreement.unit_name}`,
      description: `Owner: ${agreement.owner_signed ? 'Signed' : 'Pending'} | Renter: ${agreement.renter_signed ? 'Signed' : 'Pending'}`,
      timestamp: new Date(agreement.generated_at).toLocaleDateString(),
      avatar: agreement.renter_name.charAt(0),
    }));

  const notificationSections: SectionItem[] = data.notifications
    .slice(0, 3)
    .map((notification: DashboardResponse['recent']['notifications'][0]) => ({
      title: notification.title,
      description: notification.message,
      timestamp: new Date(notification.created_at).toLocaleDateString(),
      avatar: notification.title.charAt(0),
    }));

  const sections = [
    { title: 'Latest Rent Payments', data: rentPaymentSections },
    { title: 'Recent Tenants', data: tenantSections },
    { title: 'Recent Agreements', data: agreementSections },
    { title: 'Recent Notifications', data: notificationSections },
  ].filter((section) => section.data.length > 0);

  const renderItem = ({ item }: { item: SectionItem }) => (
    <View style={[styles.item, { borderBottomColor: theme.colors.outlineVariant }]}>
      <Avatar.Text
        size={40}
        label={item.avatar || '?'}
        style={{ backgroundColor: theme.colors.primaryContainer }}
        labelStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 16 }}
      />
      <View style={styles.itemContent}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
          {item.title}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
          {item.description}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: 4, fontSize: 11 }}
        >
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; data: SectionItem[] };
  }) => (
    <Text style={[styles.sectionHeader, { color: theme.colors.primary }]}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Recent Activity</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
});
