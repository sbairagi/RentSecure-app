# Security and Secret Handling

## Mobile Security Rules

- Never hardcode API keys, tokens, or secrets in source files.
- Use Expo environment variables (`expo-constants` or `app.config.js`) for secrets.
- Do not log sensitive data in development or production.
- Validate all API responses; never trust client-side data.
- Use HTTPS for all API calls; disable cleartext traffic in production.
- Store sensitive data in secure storage (`expo-secure-store`), not AsyncStorage.
- Avoid exposing internal API endpoints or logic in the client bundle when possible.

## Reliability Rules

- All payment or subscription flows must be idempotent on the client side where applicable.
- Network requests must support retries with backoff.
- Offline behavior must degrade gracefully.
- Async operations must support cancellation where appropriate.
