# Mobile Engineering Rules

## Architecture Rules

- Keep screens thin; delegate business logic to custom hooks or service modules.
- Use Expo Router for all navigation.
- Reusable UI must live in `src/components/`.
- Platform-specific code must be isolated behind hooks or utility functions.
- Avoid inline styles for shared components; use `StyleSheet.create`.

## Performance Rules

- Avoid unnecessary re-renders; use `memo`, `useMemo`, and `useCallback` appropriately.
- Large lists must use `FlatList` or `FlashList` with proper `keyExtractor` and `getItemLayout`.
- Images must use optimized formats and sizes; prefer `expo-image`.
- Avoid heavy synchronous operations on the JS thread.
- Use `useColorScheme` for theme switching; do not re-create theme objects on every render.

## Navigation Rules

- Use Expo Router file-based routing.
- Do not use imperative navigation inside reusable components.
- Keep route params typed and minimal.
- Deep links must be handled via Expo Linking configuration.

## State Rules

- Prefer local state for screen-scoped data.
- Use context or global state only for truly shared data.
- Keep state shape normalized where possible.
