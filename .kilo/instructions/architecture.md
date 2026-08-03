# Architecture Contract Rules

Module boundaries, folder conventions, and architecture contract guidelines for RentSecure Mobile.

## Folder Structure

- `src/app/` — Expo Router screens and layouts
- `src/components/` — Reusable UI components
- `src/hooks/` — Custom React hooks
- `src/constants/` — Theme and shared constants
- `src/assets/` — Images, fonts, icons

## Rules

- Keep screens thin; extract business logic to hooks or services.
- Components must be platform-aware when behavior differs.
- Avoid platform-specific code unless absolutely necessary.
- Shared logic should live in `src/hooks/` or utility modules.
- Do not place business logic inside screen components.
