export const formatCaretakerName = (name: string): string => {
  return name.trim();
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (!cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }
  return cleaned;
};

export const isValidPhone = (phone: string): boolean => {
  return /^\+?1?\d{9,15}$/.test(phone);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
