export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getFirstDayOfMonth(date: Date = new Date()): string {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
}

export function getLastDayOfMonth(date: Date = new Date()): string {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
}
