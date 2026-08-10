import type { UnitDocument } from '../types';

export const documentHelpers = {
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getDocumentType(mimeType: string): UnitDocument['document'] extends never ? string : string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType === 'application/msword') return 'doc';
    if (mimeType.includes('wordprocessingml')) return 'docx';
    if (mimeType.includes('spreadsheet') || mimeType === 'application/vnd.ms-excel') return 'excel';
    if (mimeType === 'text/csv' || mimeType === 'application/csv') return 'csv';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'zip';
    if (mimeType.startsWith('text/') || mimeType === 'text/html') return 'text';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    return 'other';
  },

  getDocumentIcon(documentType: string): string {
    const icons: Record<string, string> = {
      image: '🖼️',
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      excel: '📊',
      csv: '📈',
      zip: '📦',
      text: '📃',
      audio: '🎵',
      video: '🎬',
      other: '📎',
    };
    return icons[documentType] || '📄';
  },

  getDocumentColor(documentType: string): string {
    const colors: Record<string, string> = {
      image: '#10b981',
      pdf: '#dc2626',
      doc: '#2563eb',
      docx: '#2563eb',
      excel: '#16a34a',
      csv: '#16a34a',
      zip: '#f59e0b',
      text: '#6b7280',
      audio: '#8b5cf6',
      video: '#ec4899',
      other: '#6b7280',
    };
    return colors[documentType] || '#6b7280';
  },

  isPreviewable(mimeType: string): boolean {
    return (
      mimeType.startsWith('image/') ||
      mimeType === 'application/pdf' ||
      mimeType.startsWith('text/')
    );
  },

  isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  },

  getFileNameFromUri(uri: string): string {
    const parts = uri.split('/');
    return parts[parts.length - 1] || uri;
  },

  generateShareToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },
};
