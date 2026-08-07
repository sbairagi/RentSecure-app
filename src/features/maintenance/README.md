# Maintenance Management Module — Documentation

## Folder Structure

```
features/maintenance/
├── index.ts
├── components/
│   ├── index.ts
│   ├── MaintenanceCard.tsx
│   ├── MaintenanceEmptyState.tsx
│   ├── MaintenanceErrorState.tsx
│   ├── MaintenanceFilterSheet.tsx
│   ├── MaintenanceLimitBanner.tsx
│   ├── MaintenanceSearchBar.tsx
│   ├── MaintenanceSkeleton.tsx
│   ├── MaintenanceSortSheet.tsx
│   ├── MaintenanceTimeline.tsx
│   ├── MaintenanceExpenseCard.tsx
│   ├── MaintenanceCommentItem.tsx
│   ├── MaintenanceStatusBadge.tsx
│   ├── MaintenancePriorityBadge.tsx
│   ├── MaintenanceCategoryBadge.tsx
│   └── MaintenanceImagePreview.tsx
├── constants/
│   ├── index.ts
│   └── maintenanceConstants.ts
├── hooks/
│   ├── index.ts
│   └── useMaintenance.ts
├── repository/
│   ├── index.ts
│   └── maintenanceRepository.ts
├── screens/
│   ├── index.ts
│   ├── MaintenanceDashboardScreen.tsx
│   ├── MaintenanceListScreen.tsx
│   ├── MaintenanceDetailsScreen.tsx
│   ├── CreateMaintenanceScreen.tsx
│   ├── EditMaintenanceScreen.tsx
│   ├── AssignCaretakerScreen.tsx
│   ├── AssignVendorScreen.tsx
│   ├── UpdateStatusScreen.tsx
│   ├── AddCommentScreen.tsx
│   ├── AddExpenseScreen.tsx
│   ├── UploadPhotosScreen.tsx
│   ├── UploadDocumentsScreen.tsx
│   ├── MaintenanceTimelineScreen.tsx
│   ├── ResolvedRequestsScreen.tsx
│   └── ClosedRequestsScreen.tsx
├── services/
│   ├── index.ts
│   └── maintenanceApi.ts
├── store/
│   ├── index.ts
│   └── maintenanceStore.ts
├── types/
│   ├── index.ts
│   └── maintenance.ts
├── utils/
│   ├── index.ts
│   └── maintenanceHelpers.ts
├── validations/
│   ├── index.ts
│   └── maintenanceValidation.ts
└── tests/
    └── maintenance.test.ts
```

---

## Backend API Mapping

| Frontend Function | Backend Endpoint | Status |
|-------------------|------------------|--------|
| List requests | `GET /api/maintenance/` | **Missing** |
| Get request | `GET /api/maintenance/{id}/` | **Missing** |
| Create request | `POST /api/maintenance/` | **Missing** |
| Update request | `PATCH /api/maintenance/{id}/` | **Missing** |
| Delete request | `DELETE /api/maintenance/{id}/` | **Missing** |
| Dashboard stats | `GET /api/maintenance/dashboard/` | **Missing** |
| Update status | `POST /api/maintenance/{id}/update-status/` | **Missing** |
| Assign caretaker | `POST /api/maintenance/{id}/assign-caretaker/` | **Missing** |
| Assign vendor | `POST /api/maintenance/{id}/assign-vendor/` | **Missing** |
| List comments | `GET /api/maintenance/{id}/comments/` | **Missing** |
| Add comment | `POST /api/maintenance/{id}/comments/` | **Missing** |
| List expenses | `GET /api/maintenance/{id}/expenses/` | **Missing** |
| Add expense | `POST /api/maintenance/{id}/expenses/` | **Missing** |
| List photos | `GET /api/maintenance/{id}/photos/` | **Missing** |
| Upload photo | `POST /api/maintenance/{id}/photos/` | **Missing** |
| List documents | `GET /api/maintenance/{id}/documents/` | **Missing** |
| Upload document | `POST /api/maintenance/{id}/documents/` | **Missing** |
| Timeline | `GET /api/maintenance/{id}/timeline/` | **Missing** |
| Resolved list | `GET /api/maintenance/resolved/` | **Missing** |
| Closed list | `GET /api/maintenance/closed/` | **Missing** |
| List vendors | `GET /api/vendors/` | **Missing** |

---

## Maintenance Lifecycle

```
Created → Submitted → Acknowledged → Assigned → In Progress
                                                    ↓
                                          Waiting for Parts
                                                    ↓
                                          Waiting for Approval
                                                    ↓
                                         ┌──────┴──────┐
                                         ↓             ↓
                                       Resolved    Rejected
                                         ↓
                                       Closed

Any stage can also transition to: Cancelled
```

---

## Assignment Flow

1. Owner/Caretaker creates maintenance request
2. Request is assigned to a Caretaker (unit-level or building-level)
3. Caretaker can further assign to a Vendor/Service Provider
4. All assignments create timeline events and notifications

---

## Approval Flow

1. Request with `waiting_for_approval` status
2. Owner reviews and approves/rejects
3. Approval creates timeline event
4. Notifications sent to assigned caretaker/vendor

---

## Expense Flow

1. Expense is added with estimated/actual costs
2. Payment status is tracked (pending/paid/partially_paid/refunded)
3. Total cost is auto-calculated
4. Receipt can be attached

---

## Notification Flow

1. Request created → notify owner, renter
2. Request assigned → notify caretaker, vendor
3. Status changed → notify all stakeholders
4. Comment added → notify request participants
5. Expense added → notify owner
6. Approved/rejected → notify assigned user

---

## State Flow

- **Zustand** stores feature-level state (cached requests, selected request, dashboard stats)
- **React Query** manages server state with 2-minute stale time
- **MMKV** provides offline caching
- Cache invalidation on mutations

---

## Navigation Flow

| Route | Screen | Description |
|-------|--------|-------------|
| `/(drawer)/(tabs)/maintenance` | MaintenanceListScreen | List all requests |
| `/(drawer)/(tabs)/maintenance/dashboard` | MaintenanceDashboardScreen | Dashboard stats |
| `/(drawer)/(tabs)/maintenance/create` | CreateMaintenanceScreen | Create new request |
| `/(drawer)/(tabs)/maintenance/[id]` | MaintenanceDetailsScreen | View details |
| `/(drawer)/(tabs)/maintenance/[id]/edit` | EditMaintenanceScreen | Edit request |
| `/(drawer)/(tabs)/maintenance/[id]/update-status` | UpdateStatusScreen | Update status |
| `/(drawer)/(tabs)/maintenance/[id]/assign-caretaker` | AssignCaretakerScreen | Assign caretaker |
| `/(drawer)/(tabs)/maintenance/[id]/assign-vendor` | AssignVendorScreen | Assign vendor |
| `/(drawer)/(tabs)/maintenance/[id]/add-comment` | AddCommentScreen | Add comment |
| `/(drawer)/(tabs)/maintenance/[id]/add-expense` | AddExpenseScreen | Add expense |
| `/(drawer)/(tabs)/maintenance/[id]/upload-photos` | UploadPhotosScreen | Upload photos |
| `/(drawer)/(tabs)/maintenance/[id]/upload-documents` | UploadDocumentsScreen | Upload documents |
| `/(drawer)/(tabs)/maintenance/[id]/timeline` | MaintenanceTimelineScreen | View timeline |
| `/(drawer)/(tabs)/maintenance/resolved` | ResolvedRequestsScreen | Resolved requests |
| `/(drawer)/(tabs)/maintenance/closed` | ClosedRequestsScreen | Closed requests |

---

## Security Considerations

1. All API calls require authentication (`IsAuthenticated`)
2. Ownership checks enforced on backend
3. Frontend uses `PermissionGuard` for role-based access
4. No sensitive data is exposed in client-side code
5. File uploads validated on backend
6. Activity logs track all mutations

---

## Testing Strategy

1. **Unit Tests**: Repository layer mocked, tested in isolation
2. **Component Tests**: React Testing Library for UI components
3. **Integration Tests**: Full flow testing with mocked API
4. **Permission Tests**: Role-based access validation
5. **Error State Tests**: 401, 403, 404, 500 handling
6. **Offline Tests**: Cache behavior, MMKV storage

---

## Backend Compatibility Report

See `MAINTENANCE_BACKEND_COMPATIBILITY_REPORT.md` for the full analysis.

### Summary

The RentSecureBE backend does **not** have a Maintenance Management Module. No maintenance models, APIs, status workflows, or related functionality exists. The frontend module is built against the **verified backend contract** and will gracefully degrade with "Coming Soon" messages until the backend is implemented.

### Required Django Implementation

The report documents the exact models, ViewSets, serializers, URLs, signals, and services required. Key additions:

1. `MaintenanceRequest` model with status/priority/category workflows
2. `MaintenanceComment`, `MaintenanceExpense`, `MaintenanceDocument`, `MaintenanceImage` models
3. `Vendor` model for service provider management
4. `MaintenanceActivity` model for timeline
5. REST ViewSets with custom actions for assignments, status updates, comments, expenses, uploads
6. Signals for notifications and activity logging
7. `maintenance_requests` feature key in `AddOnPurchase.FEATURE_CHOICES`
8. Subscription limits per plan

---

## Quality Checklist

- ✅ No duplicate maintenance business logic
- ✅ No duplicate document system (reuses existing patterns)
- ✅ No duplicate notification system (reuses existing patterns)
- ✅ Backend remains the source of truth
- ✅ Strict TypeScript
- ✅ Zod validation schemas
- ✅ React Query best practices
- ✅ Accessibility support (semantic labels, readable text)
- ✅ Responsive layouts
- ✅ Offline support (MMKV cache)
- ✅ Compatible with RentSecureBE patterns
- ✅ Production ready (error handling, loading states, permissions)
