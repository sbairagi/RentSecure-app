export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = now.getTime() - due.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function isOverdue(dueDate: string): boolean {
  return getDaysOverdue(dueDate) > 0;
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

export function maskTransactionId(transactionId: string): string {
  if (transactionId.length <= 8) return transactionId;
  return `${transactionId.slice(0, 4)}...${transactionId.slice(-4)}`;
}

export function calculateTotalAmount(
  amount: string,
  tax: string = '0',
  discount: string = '0',
  lateFee: string = '0'
): string {
  const a = parseFloat(amount) || 0;
  const t = parseFloat(tax) || 0;
  const d = parseFloat(discount) || 0;
  const l = parseFloat(lateFee) || 0;
  return (a + t + l - d).toFixed(2);
}

export function getPaymentMethodIcon(method: string): string {
  const icons: Record<string, string> = {
    cash: 'cash',
    bank_transfer: 'bank',
    upi: 'cellphone',
    cheque: 'checkbook',
    credit_card: 'credit-card',
    debit_card: 'credit-card-outline',
    wallet: 'wallet',
    net_banking: 'web',
    other: 'dots-horizontal',
  };
  return icons[method] || 'dots-horizontal';
}
