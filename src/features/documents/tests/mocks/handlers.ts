import { http, HttpResponse } from 'msw';
import { mockUnitDocument, mockUnitImage, mockDocumentListResponse, mockImageListResponse } from './data';

export const documentsHandlers = [
  http.get('/properties/unit-all-documents/', () => {
    return HttpResponse.json(mockDocumentListResponse);
  }),

  http.post('/properties/unit-all-documents/', () => {
    return HttpResponse.json(mockUnitDocument, { status: 201 });
  }),

  http.patch('/properties/unit-all-documents/1', () => {
    return HttpResponse.json({ ...mockUnitDocument, document: '/media/unit_documents/2024/01/15/updated.pdf' });
  }),

  http.delete('/properties/unit-all-documents/1', () => {
    return HttpResponse.json(null, { status: 204 });
  }),

  http.get('/properties/unit-images/', () => {
    return HttpResponse.json(mockImageListResponse);
  }),

  http.post('/properties/unit-images/', () => {
    return HttpResponse.json(mockUnitImage, { status: 201 });
  }),

  http.patch('/properties/unit-images/1', () => {
    return HttpResponse.json({ ...mockUnitImage, image: '/media/unit_images/2024/01/15/updated.jpg' });
  }),

  http.delete('/properties/unit-images/1', () => {
    return HttpResponse.json(null, { status: 204 });
  }),
];
