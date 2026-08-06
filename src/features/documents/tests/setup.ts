import { http, HttpResponse } from 'msw';
import { documentsHandlers } from './handlers';

export const server = http.create({ onUnhandledRequest: 'warn' });

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
