import { http } from 'msw';

export const server = http.create({ onUnhandledRequest: 'warn' });
