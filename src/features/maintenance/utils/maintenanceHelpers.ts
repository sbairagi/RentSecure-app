export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    created: 'Created',
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    waiting_for_parts: 'Waiting for Parts',
    waiting_for_approval: 'Waiting for Approval',
    resolved: 'Resolved',
    closed: 'Closed',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };
  return labels[priority] || priority;
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    ac: 'AC',
    appliance: 'Appliance',
    carpentry: 'Carpentry',
    cleaning: 'Cleaning',
    security: 'Security',
    water: 'Water',
    internet: 'Internet',
    other: 'Other',
  };
  return labels[category] || category;
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    plumbing: '🚰',
    electrical: '⚡',
    ac: '❄️',
    appliance: '🔌',
    carpentry: '🔨',
    cleaning: '🧹',
    security: '🔒',
    water: '💧',
    internet: '📶',
    other: '📋',
  };
  return icons[category] || '📋';
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

export const formatCurrency = (amount: string | number | null | undefined): string => {
  if (amount === null || amount === undefined || amount === '') return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return `₹${num.toFixed(2)}`;
};
