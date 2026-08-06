import { describe, it, expect } from '@jest/globals';
import { documentHelpers } from '../../utils/documentHelpers';

describe('documentHelpers', () => {
  describe('formatSize', () => {
    it('should format bytes correctly', () => {
      expect(documentHelpers.formatSize(0)).toBe('0 Bytes');
      expect(documentHelpers.formatSize(1024)).toBe('1 KB');
      expect(documentHelpers.formatSize(1024 * 1024)).toBe('1 MB');
      expect(documentHelpers.formatSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('getDocumentType', () => {
    it('should detect image MIME type', () => {
      expect(documentHelpers.getDocumentType('image/jpeg')).toBe('image');
      expect(documentHelpers.getDocumentType('image/png')).toBe('image');
    });

    it('should detect PDF MIME type', () => {
      expect(documentHelpers.getDocumentType('application/pdf')).toBe('pdf');
    });

    it('should detect Word MIME type', () => {
      expect(documentHelpers.getDocumentType('application/msword')).toBe('doc');
      expect(documentHelpers.getDocumentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toBe('docx');
    });

    it('should detect video MIME type', () => {
      expect(documentHelpers.getDocumentType('video/mp4')).toBe('video');
    });

    it('should detect audio MIME type', () => {
      expect(documentHelpers.getDocumentType('audio/mpeg')).toBe('audio');
    });

    it('should default to text for unknown types', () => {
      expect(documentHelpers.getDocumentType('application/octet-stream')).toBe('text');
    });
  });

  describe('getDocumentIcon', () => {
    it('should return correct icon for each type', () => {
      expect(documentHelpers.getDocumentIcon('pdf')).toBe('📄');
      expect(documentHelpers.getDocumentIcon('image')).toBe('🖼️');
      expect(documentHelpers.getDocumentIcon('video')).toBe('🎬');
      expect(documentHelpers.getDocumentIcon('audio')).toBe('🎵');
    });

    it('should return default icon for unknown types', () => {
      expect(documentHelpers.getDocumentIcon('unknown')).toBe('📄');
    });
  });

  describe('getDocumentColor', () => {
    it('should return correct color for each type', () => {
      expect(documentHelpers.getDocumentColor('pdf')).toBe('#dc2626');
      expect(documentHelpers.getDocumentColor('image')).toBe('#10b981');
      expect(documentHelpers.getDocumentColor('zip')).toBe('#f59e0b');
    });
  });

  describe('isPreviewable', () => {
    it('should return true for previewable types', () => {
      expect(documentHelpers.isPreviewable('image/jpeg')).toBe(true);
      expect(documentHelpers.isPreviewable('application/pdf')).toBe(true);
      expect(documentHelpers.isPreviewable('text/plain')).toBe(true);
    });

    it('should return false for non-previewable types', () => {
      expect(documentHelpers.isPreviewable('application/zip')).toBe(false);
      expect(documentHelpers.isPreviewable('video/mp4')).toBe(false);
    });
  });

  describe('generateShareToken', () => {
    it('should generate a unique token', () => {
      const token1 = documentHelpers.generateShareToken();
      const token2 = documentHelpers.generateShareToken();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(10);
    });
  });
});
