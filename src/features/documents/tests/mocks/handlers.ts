import { http, HttpResponse } from 'msw';
import { mockDocument, mockDocumentListResponse, mockDocumentVersion, mockDocumentShareResponse, mockDocumentUsageLimits, mockFolderNode } from './data';

export const documentsHandlers = [
  http.get('/api/documents/', () => {
    return HttpResponse.json(mockDocumentListResponse);
  }),

  http.get('/api/documents/1', () => {
    return HttpResponse.json(mockDocument);
  }),

  http.post('/api/documents/', () => {
    return HttpResponse.json(mockDocument, { status: 201 });
  }),

  http.patch('/api/documents/1', () => {
    return HttpResponse.json({ ...mockDocument, name: 'Updated Document' });
  }),

  http.delete('/api/documents/1', () => {
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post('/api/documents/upload', () => {
    return HttpResponse.json(mockDocument, { status: 201 });
  }),

  http.get('/api/documents/1/download', () => {
    return HttpResponse.json({ url: 'https://example.com/download/doc_1' });
  }),

  http.get('/api/documents/1/preview', () => {
    return HttpResponse.json({ url: 'https://example.com/preview/doc_1' });
  }),

  http.post('/api/documents/1/share', () => {
    return HttpResponse.json(mockDocumentShareResponse);
  }),

  http.post('/api/documents/1/favorite', () => {
    return HttpResponse.json({ ...mockDocument, is_favorite: true });
  }),

  http.post('/api/documents/1/archive', () => {
    return HttpResponse.json({ ...mockDocument, is_archived: true });
  }),

  http.post('/api/documents/1/restore', () => {
    return HttpResponse.json({ ...mockDocument, is_archived: false });
  }),

  http.get('/api/documents/1/versions', () => {
    return HttpResponse.json([mockDocumentVersion]);
  }),

  http.get('/api/documents/duplicates', () => {
    return HttpResponse.json([mockDocument]);
  }),

  http.get('/api/documents/folders', () => {
    return HttpResponse.json([mockFolderNode]);
  }),

  http.get('/api/documents/usage-limits', () => {
    return HttpResponse.json(mockDocumentUsageLimits);
  }),

  http.post('/api/documents/bulk-delete', () => {
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post('/api/documents/bulk-move', () => {
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post('/api/documents/bulk-download', () => {
    return new HttpResponse(new Blob(), { status: 200 });
  }),

  http.get('/api/documents/search', () => {
    return HttpResponse.json([mockDocument]);
  }),
];
