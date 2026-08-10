# Backend Compatibility Report — Step 35 Renter Dashboard
**Date:** 2026-08-10
**Backend:** RentSecureBE (Django 5.2.1 + DRF)
**Frontend:** RentSecure (Expo SDK 57 + React Native + TypeScript)

---

## 1. Existing Renter Dashboard Endpoint
**Status:** DOES NOT EXIST
**Gap:** No aggregation endpoint for renter dashboard. Frontend must compose dashboard from multiple endpoints.

## 2. Existing RentRecord Endpoint
**Status:** PARTIAL — owner-only ViewSet
- `GET /properties/rent-records/` → `RentRecordViewSet.list` — queryset: `RentRecord.objects.filter(unit__owner=user)` (owner-only)
- `GET /properties/renter/rent-history/` → `rent_history` — renter-scoped, returns all records without pagination
- `GET /properties/renter/rent-due/` → `get_latest_due_rent` — returns latest pending rent only

**Field Mapping (`rent_history` response):**
```json
{
  "month": "due_date.month",
  "year": "due_date.year",
  "amount": "amount",
  "status": "payment_status (alias for status)",
  "invoice_url": "invoice_pdf.url if status==PAID else null",
  "payment_link": "payment_link"
}
```

## 3. Existing Payment History Endpoint
**Status:** EXISTS via `GET /properties/renter/rent-history/`
**Limitations:** No pagination, no filters, returns all records

## 4. Existing Invoice Endpoint
**Status:** EXISTS BUT BUGGY + OWNER-ONLY
- `GET /properties/rent-records/<rent_id>/invoice/` → `download_rent_invoice`
- **SECURITY BUG:** Uses `get_object_or_404(RentRecord, id=rent_id, owner=request.user)` but `RentRecord` has no `owner` field. This will throw `FieldError`.
- Invoice is not a first-class model. It's a `FileField` on `RentRecord` generated on demand via `generate_rent_invoice_pdf()`.

## 5. Existing Payment-Link Endpoint
**Status:** Payment links are created server-side when owner creates a `RentRecord`
- Field: `RentRecord.payment_link` (CharField 500)
- Accessible to renter via `rent-due/` and `rent-history/` responses
- Payment provider: Razorpay (feature-flagged)

## 6. Existing Payment Verification Endpoint
**Status:** Webhook-only, no frontend-facing endpoint
- `POST /api/rent/payment-callback/` — Razorpay webhook (HMAC-SHA256 verified, CSRF exempt)
- Updates `RentRecord.status = PAID`, `paid_on = today`
- No way for frontend to poll/payment status directly

## 7. Existing Agreement Endpoint
**Status:** EXISTS BUT RENTER CANNOT ACCESS
- `RentAgreementDraftViewSet` — queryset: `RentAgreementDraft.objects.filter(user=user)` (owner-only)
- PDF generation: `GET /documents/document/rent_agreement/<id>/generate-rent-agreement-pdf/`
- No renter-scoped agreement access

## 8. Existing Maintenance Endpoint
**Status:** NO DEDICATED MAINTENANCE APP
- `ExtraCharge` model exists (for electricity, water, society dues)
- `ExtraChargeViewSet` supports both owner and renter access:
  - If user has `renter_profile`: `ExtraCharge.objects.filter(renter=renter_profile)`
  - Otherwise: `ExtraCharge.objects.filter(unit__owner=user)`
- Notification types reference `maintenance_created` and `maintenance_update` but no separate maintenance request CRUD

## 9. Existing Notification Endpoint
**Status:** FULLY FUNCTIONAL
- `GET /api/notifications/get/` — paginated, filterable by search, type, read_status, date range
- `GET /api/notifications/unread-count/`
- `POST /api/notifications/mark/<id>/`
- `POST /api/notifications/mark-all-read/`
- `DELETE /api/notifications/<id>/`
- User-scoped (`request.user.notifications`), so renters can access their own

**Notification Types (relevant to renter):**
- `rent_due`, `payment_success`, `payment_failed`, `agreement_expiry`, `agreement_signed`, `document_shared`, `renter_status_change`, `extra_charge_reminder`

## 10. Existing Document Endpoint
**Status:** OWNER-ONLY
- `UnitDocumentViewSet` — queryset: `UnitDocument.objects.filter(unit__owner=user)`
- Renter has `id_proof` and `rent_agreement` FileFields on the `Renter` model
- No renter-facing document access API

## 11. Renter Permission Model
**Status:** No custom DRF permissions
- All ViewSets use `IsAuthenticated`
- Ownership enforced in `perform_create`/`perform_update`/`perform_destroy` and serializer `validate()`
- Renter user → `Renter` profile via `user.renter_profile` (OneToOne)

## 12. Pagination
**Status:** No DRF default pagination configured
- Notification views implement manual pagination (page + limit, max 100)
- All other list endpoints return full querysets

## 13. Cache Strategy
- LocMemCache, 300s TTL
- Per-user keys: `renters_user_{id}`, `rent_records_user_{id}`, `units_user_{id}`, `buildings_user_{id}`, etc.
- Cache invalidated on create/update/destroy

## 14. Existing Payment Status Fields
- `RentRecord.status`: `pending`, `paid`, `overdue`, `cancelled` (lowercase)
- `RentRecord.payment_status` — Python property alias for `status`
- `RentRecord.payout_status`: `PENDING`, `SUCCESS`, `FAILED` (uppercase, free CharField)

## 15. Existing Invoice Status Fields
- **No Invoice model**
- Invoice status proxied via `RentRecord.status`
- Invoice PDF stored in `RentRecord.invoice_pdf` FileField

---

## Backend Gaps Identified

### Gap 1: No Renter Profile Endpoint
**Current:** `RenterViewSet` is owner-only (`unit__owner=user`)
**Needed:** `GET /properties/renter/profile/` — returns current renter's profile
**Response:** Renter fields: `id, name, email, phone, status, rent_amount, start_date, end_date, unit, building_name, ...`

### Gap 2: No Paginated Renter Rent Records Endpoint
**Current:** `GET /properties/renter/rent-history/` returns all records without pagination
**Needed:** `GET /properties/renter/rent-records/` — paginated, detailed rent records for current renter

### Gap 3: No Single Renter Rent Record Detail Endpoint
**Current:** No way to get full details of a single rent record as renter
**Needed:** `GET /properties/renter/rent-records/{id}/`

### Gap 4: Invoice Download is Owner-Only + Buggy
**Current:** `download_rent_invoice` uses non-existent `owner` field on `RentRecord`
**Needed:** Fix to allow both owner and renter access with proper ownership checks

### Gap 5: No Renter Agreement Access
**Current:** `RentAgreementDraftViewSet` is user=owner only
**Needed:** Renter-scoped agreement access via `renter__user=request.user`

### Gap 6: No Renter Document Access
**Current:** `UnitDocumentViewSet` is owner-only
**Needed:** Renter-scoped access to their own documents (`id_proof`, `rent_agreement` from Renter model)

### Gap 7: No Renter Dashboard Aggregation
**Current:** No aggregation endpoint
**Needed:** `GET /properties/renter/dashboard/` — aggregates profile, current rent, recent payments, agreement, notifications count

---

## Proposed Backend Endpoints

### Endpoint 1: Renter Profile
- **Path:** `GET /properties/renter/profile/`
- **Method:** GET
- **Permission:** IsAuthenticated
- **Serializer:** `RenterProfileSerializer` (safe fields, excludes `id_proof` path, `rent_agreement` path from general list — expose download URLs separately)
- **Query optimization:** `select_related("unit", "unit__building")`
- **Pagination:** N/A
- **Caching:** 120s per-user
- **Tests:** Test renter access, test non-renter access (403), test cross-renter access (403)

### Endpoint 2: Renter Rent Records (List)
- **Path:** `GET /properties/renter/rent-records/`
- **Method:** GET
- **Permission:** IsAuthenticated
- **Serializer:** `RenterRentRecordDetailSerializer`
- **Query optimization:** `RentRecord.objects.filter(renter__user=user).select_related("unit", "renter", "renter__unit", "renter__unit__building")`
- **Pagination:** 20 per page (manual, consistent with notifications)
- **Caching:** 120s per-user
- **Tests:** Test pagination, test IDOR, test empty state

### Endpoint 3: Renter Rent Record Detail
- **Path:** `GET /properties/renter/rent-records/{id}/`
- **Method:** GET
- **Permission:** IsAuthenticated
- **Serializer:** `RenterRentRecordDetailSerializer`
- **Query optimization:** `select_related("unit", "renter", "renter__unit", "renter__unit__building")`
- **Pagination:** N/A
- **Caching:** 120s per-user
- **Tests:** Test IDOR, test not found, test cross-renter access

### Endpoint 4: Renter Agreement
- **Path:** `GET /properties/renter/agreement/`
- **Method:** GET
- **Permission:** IsAuthenticated
- **Serializer:** `RenterAgreementSerializer`
- **Query optimization:** `RentAgreementDraft.objects.filter(renter__user=user).select_related("renter", "unit", "unit__building")`
- **Pagination:** N/A
- **Caching:** 300s per-user
- **Tests:** Test access, test no agreement state, test cross-renter access

### Endpoint 5: Renter Documents
- **Path:** `GET /properties/renter/documents/`
- **Method:** GET
- **Permission:** IsAuthenticated
- **Serializer:** `RenterDocumentSerializer`
- **Query optimization:** Single Renter object with select_related
- **Pagination:** N/A
- **Caching:** 300s per-user
- **Tests:** Test access, test document URLs, test cross-renter access

### Endpoint 6: Renter Dashboard
- **Path:** `GET /properties/renter/dashboard/`
- **Method:** GET
- **Permission:** IsAuthenticated
- **Serializer:** `RenterDashboardSerializer`
- **Query optimization:** Aggregated single query with select_related/prefetch_related
- **Pagination:** N/A
- **Caching:** 60s per-user
- **Tests:** Test full dashboard, test partial data, test empty state

### Fix: Invoice Download Ownership
- **Path:** `GET /properties/rent-records/{rent_id}/invoice/`
- **Fix:** Change from `owner=request.user` to allow `unit__owner=request.user` OR `renter__user=request.user`
- **Tests:** Test owner access, test renter access, test cross-renter access rejection
