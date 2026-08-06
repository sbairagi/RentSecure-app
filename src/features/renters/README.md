# Renter Management Module

## Architecture

```
features/renters/
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

| Frontend Action      | Backend Endpoint                   | Method   | Status      |
| -------------------- | ---------------------------------- | -------- | ----------- |
| List renters         | `/api/renters/`                    | GET      | Implemented |
| Get renter           | `/api/renters/{id}/`               | GET      | Implemented |
| Create renter        | `/api/renters/`                    | POST     | Implemented |
| Update renter        | `/api/renters/{id}/`               | PATCH    | Implemented |
| Delete renter        | `/api/renters/{id}/`               | DELETE   | Implemented |
| Rate renter          | `/api/renters/{id}/rate/`          | POST     | Implemented |
| Update status        | `/api/renters/{id}/update-status/` | POST     | Implemented |
| Vacate renter        | `/api/renters/{id}/vacate/`        | POST     | Implemented |
| Status summary       | `/api/renters/status_summary/`     | GET      | Implemented |
| Recent activity      | `/api/renters/recent_activity/`    | GET      | Implemented |
| Timeline             | `/api/renters/{id}/timeline/`      | GET      | Missing API |
| Assign unit          | `/api/renters/{id}/assign-unit/`   | POST     | Missing API |
| Transfer unit        | `/api/renters/{id}/transfer-unit/` | POST     | Missing API |
| KYC documents        | `/api/renters/{id}/kyc-documents/` | GET      | Missing API |
| Documents            | `/api/renters/{id}/documents/`     | GET      | Missing API |
| Notes                | `/api/renters/{id}/notes/`         | GET/POST | Missing API |
| Bulk notify          | `/api/renters/{id}/bulk-notify/`   | POST     | Missing API |
| Export               | `/api/renters/export/`             | GET      | Missing API |
| Import               | `/api/renters/bulk-import/`        | POST     | Missing API |
| Rent records         | `/api/rent-records/`               | GET      | Implemented |
| Extra charges        | `/api/extra-charges/`              | GET      | Implemented |
| Police verifications | `/api/police-verifications/`       | GET      | Implemented |
| Agreements           | `/api/rent-agreements/`            | GET      | Implemented |
| Notifications        | `/api/notifications/get/`          | GET      | Implemented |
| Bootstrap            | `/api/auth/bootstrap/`             | GET      | Implemented |
| Usage limits         | `/api/usage-limits/`               | GET      | Implemented |
| Units                | `/api/units/`                      | GET      | Implemented |
| Buildings            | `/api/buildings/`                  | GET      | Implemented |

## State Flow

1. **React Query** manages server state (fetching, caching, background refresh)
2. **Zustand** manages client state (selected renter, cached data, UI state)
3. **Optimistic updates** for mutations when possible
4. **MMKV** for offline cache persistence

## Navigation Flow

- `/(drawer)/(tabs)/renters/list` - Renter list
- `/(drawer)/(tabs)/renters/{id}` - Renter details
- `/(drawer)/(tabs)/renters/{id}/profile` - Renter profile
- `/(drawer)/(tabs)/renters/{id}/payments` - Payment history
- `/(drawer)/(tabs)/renters/{id}/rent-history` - Rent history
- `/(drawer)/(tabs)/renters/{id}/agreements` - Agreement history
- `/(drawer)/(tabs)/renters/{id}/kyc` - KYC documents
- `/(drawer)/(tabs)/renters/{id}/police-verification` - Police verification
- `/(drawer)/(tabs)/renters/{id}/documents` - Documents
- `/(drawer)/(tabs)/renters/{id}/notes` - Notes
- `/(drawer)/(tabs)/renters/{id}/timeline` - Activity timeline
- `/(drawer)/(tabs)/renters/{id}/emergency-contacts` - Emergency contacts
- `/(drawer)/(tabs)/renters/{id}/assign-unit` - Assign unit
- `/(drawer)/(tabs)/renters/{id}/transfer-unit` - Transfer unit
- `/(drawer)/(tabs)/renters/{id}/edit` - Edit renter
- `/(drawer)/(tabs)/renters/{id}/delete` - Delete confirmation
- `/(drawer)/(tabs)/renters/add` - Add new renter

## Testing Strategy

- **Unit Tests**: Helper functions, validation schemas
- **Component Tests**: React Native Testing Library
- **Integration Tests**: API integration tests
- **Mock API Tests**: Mock backend responses

## Permissions

- `renter:read` - View renters
- `renter:write` - Create/edit renters

## Feature Limits

- `max_renters` - Maximum number of renters allowed
- `max_document_uploads` - Maximum document uploads
- `max_kyc_documents` - Maximum KYC documents

## Error Handling

All API errors are handled through the global `apiService` which maps HTTP status codes to user-friendly messages:

| Status | Code             | User Message                        |
| ------ | ---------------- | ----------------------------------- |
| 401    | UNAUTHORIZED     | Please log in again                 |
| 403    | FORBIDDEN        | You don't have permission           |
| 404    | NOT_FOUND        | Renter not found                    |
| 409    | CONFLICT         | Action conflicts with existing data |
| 422    | VALIDATION_ERROR | Please check the entered data       |
| 429    | RATE_LIMITED     | Too many requests                   |
| 500    | SERVER_ERROR     | Server error                        |
| 503    | MAINTENANCE      | System under maintenance            |

## Offline Support

- Renters list is cached in MMKV for 5 minutes
- Background sync when network is restored
- Pull-to-refresh for manual updates
