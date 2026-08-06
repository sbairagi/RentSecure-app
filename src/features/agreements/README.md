# Enterprise Agreement Lifecycle Management Module

## Architecture

```
features/agreements/
├── components/        # Reusable UI components
├── screens/           # Expo Router screens
├── hooks/             # React Query v5 hooks
├── repository/        # Data access layer
├── services/          # API service layer
├── store/             # Zustand v5 client state
├── types/             # TypeScript type definitions
├── constants/         # API endpoints, status configs
├── utils/             # Utility functions
├── validations/       # Zod validation schemas
└── tests/             # Unit and integration tests
```

## API Mapping

| Frontend Feature | Backend API | Notes |
|-----------------|-------------|-------|
| List agreements | `GET /api/rent-agreements/` | RentAgreementDraftViewSet |
| Create agreement | `POST /api/rent-agreements/` | Creates RentAgreementDraft |
| Get agreement | `GET /api/rent-agreements/{id}/` | |
| Update agreement | `PATCH /api/rent-agreements/{id}/` | |
| Delete agreement | `DELETE /api/rent-agreements/{id}/` | |
| Generate PDF | `GET /api/document/rent_agreement/{id}/generate-rent-agreement-pdf/` | WeasyPrint |
| Signatures | `POST /api/leegality/webhook/` | Backend-driven, not called directly |
| Notifications | `GET/POST /api/notifications/` | For reminders |

## Agreement Lifecycle

Since backend has no explicit status field, frontend derives status:

1. `draft` - Not sent for signature
2. `pending_signature` - Sent but neither signed (leegality_document_id set)
3. `partially_signed` - One party signed
4. `fully_signed` - Both owner and renter signed
5. `active` - Fully signed and within date range
6. `expired` - End date passed
7. `terminated` - is_agreement_revoked on renter
8. `cancelled` - Manual cancellation (not in backend yet)

## State Flow

```
Component -> Hook (React Query) -> Repository -> API Service -> Backend
                                                    |
Store (Zustand) <- Hook <- Cache (MMKV) <- Backend Response
```

## Navigation Flow

```
/(drawer)/(tabs)/agreements                -> AgreementListScreen
/(drawer)/(tabs)/agreements/create         -> CreateAgreementScreen
/(drawer)/(tabs)/agreements/{id}           -> AgreementDetailsScreen
/(drawer)/(tabs)/agreements/{id}/edit      -> EditDraftScreen
/(drawer)/(tabs)/agreements/{id}/sign      -> DigitalSignatureScreen
/(drawer)/(tabs)/agreements/{id}/pdf       -> AgreementPreviewScreen
/(drawer)/(tabs)/agreements/{id}/timeline  -> AgreementTimelineScreen
/(drawer)/(tabs)/agreements/{id}/documents -> AgreementDocumentsScreen
/(drawer)/(tabs)/agreements/{id}/witnesses -> WitnessDetailsScreen
/(drawer)/(tabs)/agreements/{id}/renew     -> RenewAgreementScreen
/(drawer)/(tabs)/agreements/{id}/terminate -> TerminateAgreementScreen
/(drawer)/(tabs)/agreements/{id}/versions  -> AgreementVersionsScreen
/(drawer)/(tabs)/agreements/{id}/history   -> AgreementHistoryScreen
```

## Storage Strategy

- **Server State**: React Query v5 with 5min stale time, 10min GC time
- **Client State**: Zustand v5 with MMKV persistence
- **Cache Keys**: `agreements_cache` for offline support
- **Offline Support**: Cache agreements, background sync on reconnect

## Testing Strategy

- **Unit Tests**: API, Repository, Store, Utils, Schemas
- **Integration Tests**: React Query + Store integration flows
- **Mock Data**: Matches backend RentAgreementDraft model
- **Test Setup**: `// @ts-nocheck`, mocked MMKV and API client

## Backend Compatibility Report

| Feature | Status | Notes |
|---------|--------|-------|
| List/Create/Update/Delete | ✅ Supported | /api/rent-agreements/ endpoints |
| PDF Generation | ✅ Supported | WeasyPrint endpoint |
| Status Lifecycle | ⚠️ Derived | Frontend derives from owner_signed/renter_signed |
| Templates | ❌ Missing | Empty state, upgrade CTA |
| Witnesses | ❌ Missing | Empty state, upgrade CTA |
| Renewal/Termination | ⚠️ Partial | Uses existing revocation fields |
| Search/Filter | ❌ Missing | Client-side filtering only |
| Timeline | ❌ Missing | Empty state, upgrade CTA |
| Notifications | ✅ Supported | /api/notifications/get/ |
| Versioning | ⚠️ Partial | simple_history on backend |
| Documents | ❌ Missing | Empty state, upgrade CTA |
| Settings | ❌ Missing | Empty state, upgrade CTA |

## Feature Enforcement

- Feature key: `rent_agreement_drafts`
- Read from bootstrap/usage-limits
- Disable create if limit reached
- Show upgrade CTA

## Error Handling

- 401: Unauthorized - redirect to login
- 403: Forbidden - hide actions
- 404: Not Found - show empty state
- 409: Conflict - show conflict message
- 422: Validation Error - show field errors
- 429: Rate Limited - show retry message
- 500/503: Server Error/Maintenance - show retry
- Offline: Show offline banner, use cache

## Accessibility

- All interactive elements have `accessibilityRole` and `accessibilityLabel`
- Status badges have `accessibilityRole="text"`
- Buttons have descriptive labels
