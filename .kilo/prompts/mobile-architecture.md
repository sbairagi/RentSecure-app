# Mobile Architecture Guidance

Use this guidance when architecting React Native/Expo mobile features.

## Principles

- Keep screens thin and focused on UI composition.
- Extract business logic into custom hooks or service modules.
- Use Expo Router for all navigation; avoid imperative routing in reusable code.
- Isolate platform-specific code behind hooks or utility functions.
- Keep components reusable and platform-consistent.

## Review Checklist

- Check existing components and hooks before adding new ones.
- Prefer extending existing patterns over creating new abstractions.
- Use TypeScript strictly; avoid `any`.
- Ensure images and assets are optimized for mobile.
- Validate navigation structure and deep link handling.
- Keep async behavior explicit and cancellable where possible.
