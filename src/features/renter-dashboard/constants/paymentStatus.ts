export const RENTER_PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; backgroundColor: string; icon: string }> = {
  pending: {
    label: 'Pending',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    icon: '⏳',
  },
  paid: {
    label: 'Paid',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    icon: '✅',
  },
  overdue: {
    label: 'Overdue',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    icon: '⚠️',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    icon: '🚫',
  },
};

export const RENTER_PAYMENT_METHOD_CONFIG: Record<string, { label: string; icon: string }> = {
  cash: { label: 'Cash', icon: '💵' },
  bank_transfer: { label: 'Bank Transfer', icon: '🏦' },
  upi: { label: 'UPI', icon: '📱' },
  cheque: { label: 'Cheque', icon: '📝' },
  card: { label: 'Card', icon: '💳' },
  online: { label: 'Online', icon: '🌐' },
  other: { label: 'Other', icon: '📦' },
};