# Expo Router Rules

- Use file-based routing in `src/app/`.
- Keep route groups organized by feature or domain.
- Use typed routes when possible (`experiments.typedRoutes` enabled).
- Avoid deep nesting beyond 3 levels unless justified.
- Use layout files for shared navigation chrome.
- Use `useRouter` and `useLocalSearchParams` for navigation and params.
- Do not bypass Expo Router with imperative navigation unless there is a clear reason.
