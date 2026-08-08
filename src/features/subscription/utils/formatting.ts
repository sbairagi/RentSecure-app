export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatUsage(current: number, limit: number | 'unlimited'): string {
  if (limit === 'unlimited') return `${current} / Unlimited`;
  return `${current} / ${limit}`;
}

export function getUsageColor(percentage: number): string {
  if (percentage >= 90) return '#DC2626';
  if (percentage >= 70) return '#D97706';
  return '#059669';
}

export function getPlanBadgeColor(planName: string): string {
  const colors: Record<string, string> = {
    free: '#6B7280',
    pro: '#2563EB',
    elite: '#7C3AED',
  };
  return colors[planName] || '#6B7280';
}

export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getPlanDisplayName(planName: string): string {
  const names: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    elite: 'Elite',
  };
  return names[planName] || planName;
}
