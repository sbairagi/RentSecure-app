# Unit Management Module

## Architecture

```
features/units/
├── components/        # Reusable UI components
├── screens/           # Screen components
├── hooks/             # React Query hooks
├── repository/        # Data access layer
├── services/          # API service layer
├── store/             # Zustand store (offline support)
├── types/             # TypeScript type definitions
├── constants/         # Constants and configuration
├── utils/             # Helper functions
├── validations/       # Zod validation schemas
└── tests/             # Unit tests
```

## API Mapping

| Frontend Action | Backend Endpoint                | Method |
| --------------- | ------------------------------- | ------ |
| List units      | `/api/units/`                   | GET    |
| Get unit        | `/api/units/{id}/`              | GET    |
| Create unit     | `/api/units/`                   | POST   |
| Update unit     | `/api/units/{id}/`              | PATCH  |
| Delete unit     | `/api/units/{id}/`              | DELETE |
| Occupancy stats | `/api/units/occupancy_stats`    | GET    |
| Upload image    | `/api/unit-images/`             | POST   |
| Delete image    | `/api/unit-images/{id}/`        | DELETE |
| Upload document | `/api/unit-all-documents/`      | POST   |
| Delete document | `/api/unit-all-documents/{id}/` | DELETE |
| Bulk operations | `/api/units/bulk/`              | POST   |
| Import          | `/api/units/import/`            | POST   |
| Export          | `/api/units/export/`            | GET    |

## State Flow

1. **React Query** manages server state (fetching, caching, background refresh)
2. **Zustand** manages client state (selected unit, cached data, UI state)
3. **Optimistic updates** for mutations when possible
4. **MMKV** for offline cache persistence

## Navigation Flow

- `/(drawer)/(tabs)/units/list` - Unit list
- `/(drawer)/(tabs)/units/{id}` - Unit details
- `/(drawer)/(tabs)/units/{id}/analytics` - Unit analytics
- `/(drawer)/(tabs)/units/{id}/documents` - Documents
- `/(drawer)/(tabs)/units/{id}/gallery` - Gallery
- `/(drawer)/(tabs)/units/{id}/timeline` - Timeline
- `/(drawer)/(tabs)/units/{id}/edit` - Edit unit
- `/(drawer)/(tabs)/units/{id}/delete` - Delete confirmation
- `/(drawer)/(tabs)/units/{id}/assign-renter` - Assign renter
- `/(drawer)/(tabs)/units/{id}/assign-caretaker` - Assign caretaker
- `/(drawer)/(tabs)/units/add` - Add new unit

## Testing Strategy

- **Unit Tests**: Helper functions, validation schemas
- **Component Tests**: React Native Testing Library
- **Integration Tests**: API integration tests
- **Mock API Tests**: Mock backend responses

## Permissions

- `unit:read` - View units
- `unit:write` - Create/edit units
