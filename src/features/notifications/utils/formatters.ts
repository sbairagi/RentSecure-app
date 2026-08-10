export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getNotificationTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    rent_due: '#D97706',
    payment_success: '#059669',
    payment_failed: '#DC2626',
    agreement_expiry: '#7C3AED',
    agreement_signed: '#2563EB',
    maintenance_created: '#0891B2',
    maintenance_update: '#0891B2',
    visitor_request: '#059669',
    visitor_approved: '#059669',
    subscription_expiry: '#DC2626',
    subscription_expired: '#DC2626',
    document_shared: '#2563EB',
    system_announcement: '#6B7280',
    payout_success: '#059669',
    payout_failed: '#DC2626',
    renter_status_change: '#7C3AED',
    itr_reminder: '#2563EB',
    tax_reminder: '#0891B2',
    extra_charge_reminder: '#D97706',
  };
  return typeColors[type] || '#6B7280';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: '#6B7280',
    medium: '#2563EB',
    high: '#D97706',
    urgent: '#DC2626',
  };
  return colors[priority] || '#6B7280';
}
