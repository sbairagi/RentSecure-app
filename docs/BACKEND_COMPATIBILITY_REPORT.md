# Backend Compatibility Report — Enterprise Profile, Account & Settings Module

## Source of Truth
RentSecureBE at `/Users/sbairagi/Desktop/MVP Project/RentSecureBE`  
Branch: main (as of 2026-08-07)

---

## 1. User Model

### `core.models.User` (extends `AbstractUser`)
| Field | Type | Notes |
|---|---|---|
| `id` | AutoField | PK |
| `username` | CharField | Phone-based |
| `email` | EmailField | Login via email/password |
| `full_name` | CharField(100) | Display name |
| `phone` | CharField(15) | Optional |
| `is_investor` | BooleanField | Default False |
| `is_phone_verified` | BooleanField | Set True after OTP |
| `whatsapp_number` | CharField(15) | With country code |
| `first_name` | CharField | From AbstractUser |
| `last_name` | CharField | From AbstractUser |
| `groups` | ManyToMany(Group) | Role assignment: `owner`, `renter`, `caretaker` |
| `history` | HistoricalRecords | simple-history audit |

### `core.models.UserProfile` (OneToOne with User)
| Field | Type | Notes |
|---|---|---|
| `user` | OneToOneKey(User) | |
| `whatsapp_number` | CharField(15) | |
| `whatsapp_opt_in` | BooleanField | Default True |
| `language_preference` | CharField(2) | Choices: en, hi |
| `alert_frequency` | CharField | daily/weekly/monthly |
| `receive_rent_alerts` | BooleanField | Default True |
| `receive_tax_alerts` | BooleanField | Default True |
| `receive_vacancy_alerts` | BooleanField | Default True |
| `receive_flagged_alerts` | BooleanField | Default True |
| `receive_voice_alerts` | BooleanField | Default True |
| `greeting_prefix` | CharField(100) | |
| `reminder_time` | TimeField | Default 09:00 |
| `rent_reminders_enabled` | BooleanField | |
| `salary` | PositiveIntegerField | ITR calc |
| `other_income` | PositiveIntegerField | |
| `elss_investment` | PositiveIntegerField | |
| `has_health_insurance` | BooleanField | |
| `home_loan_interest` | PositiveIntegerField | |
| `rent_paid` | PositiveIntegerField | |
| `receives_hra` | BooleanField | |
| `is_nri` | BooleanField | |
| `city` | CharField(100) | |
| `total_investment_income` | PositiveIntegerField | |

### `core.models.NotificationPreference` (OneToOne with User)
| Field | Type | Notes |
|---|---|---|
| `owner` | OneToOneKey(User) | |
| `rent_alerts_whatsapp` | BooleanField | Default True |
| `rent_alerts_email` | BooleanField | Default True |
| `monthly_summary_email` | BooleanField | Default True |
| `monthly_summary_whatsapp` | BooleanField | Default False |
| `payout_alerts_whatsapp` | BooleanField | Default True |
| `payout_alerts_email` | BooleanField | Default False |

---

## 2. User Roles

Backend uses Django Groups. The `ProfileSerializer` returns `role` from `user.groups.first().name`.

| Backend Role | Frontend Mapped Role |
|---|---|
| `owner` | `property_owner` |
| `renter` | `renter` |
| `caretaker` | `caretaker` |
| `user` | `user` |
| (no group) | `user` |

Frontend already has `BACKEND_ROLE_MAP` in `src/navigation/types/navigation.types.ts`.

---

## 3. Authentication APIs

| Method | Endpoint | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/auth/send-otp/` | None | `{phone, referral_code?}` | `{message}` |
| POST | `/auth/owner/verify-otp/` | None | `{phone, otp}` | `{refresh, access, user}` |
| POST | `/auth/renter/verify-otp/` | None | `{phone, otp}` | `{refresh, access, user}` |
| POST | `/auth/login/` | None | `{email, password}` | `{refresh, access, user}` |
| POST | `/auth/register/` | None | `{firstName, lastName, email, phone, password, confirmPassword, role}` | `{refresh, access, user}` |
| POST | `/auth/social/` | None | `{provider, token}` | `{refresh, access, user, isNewUser}` |
| POST | `/api/token/refresh/` | None | `{refresh}` | `{access, refresh?}` |
| POST | `/auth/logout/` | Required | `{refresh?}` | `{message}` |
| POST | `/auth/logout-all/` | Required | — | `{message}` |

All endpoints return user object with: `id, phone, email, firstName, lastName, fullName, username, role`.

---

## 4. Profile APIs

| Method | Endpoint | Auth | Request | Response |
|---|---|---|---|---|
| GET | `/auth/profile/` | Required | — | `{user: ProfileSerializer.data}` |
| PUT | `/auth/profile/` | Required | Partial User fields | `{user: ProfileSerializer.data}` |

**ProfileSerializer fields:** `id, username, email, full_name, phone, role, permissions`

**Editable fields via PUT:** `email, full_name, phone` (partial update supported).

**NOT supported by backend:**
- ❌ Profile photo / avatar upload
- ❌ Company / business name
- ❌ Address
- ❌ Account creation date
- ❌ Email verification status (no separate endpoint)

---

## 5. Password APIs

| Method | Endpoint | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/change-password/` | Required | `{old_password, new_password}` | `{message}` |
| POST | `/forgot-password/` | None | `{email}` | `{message}` |
| POST | `/reset-password/<token>/` | None | `{new_password, confirmPassword}` | `{message}` |
| POST | `/reset-password/` | Required | `{new_password}` | `{message}` |

---

## 6. Email Verification
**NOT IMPLEMENTED** in backend. No email verification endpoint exists.

---

## 7. Phone Verification
Implemented via OTP flow:
- `POST /auth/send-otp/` sends OTP
- `POST /auth/owner/verify-otp/` or `/auth/renter/verify-otp/` verifies OTP
- Sets `user.is_phone_verified = True`
- 5-minute OTP expiry
- 5 max attempts
- Rate limit: 60 seconds between requests, 5 per hour per phone+IP

---

## 8. MFA/2FA
**NOT IMPLEMENTED** in backend. Only biometric setup/disable endpoints exist:
- `POST /auth/biometric/setup/` — sets `userprofile.biometric_enabled = True`
- `POST /auth/biometric/disable/` — sets `userprofile.biometric_enabled = False`

---

## 9. Notification Preferences

Backend has TWO mechanisms:

**A. `NotificationPreference` model** (OneToOne with User):
- `rent_alerts_whatsapp`, `rent_alerts_email`
- `monthly_summary_email`, `monthly_summary_whatsapp`
- `payout_alerts_whatsapp`, `payout_alerts_email`
- Upsert by `owner`

**B. `UserProfile` alert fields:**
- `receive_rent_alerts`, `receive_tax_alerts`, `receive_vacancy_alerts`
- `receive_flagged_alerts`, `receive_voice_alerts`
- `language_preference`, `alert_frequency`
- `greeting_prefix`, `reminder_time`, `rent_reminders_enabled`

**API endpoint:**
- `POST /api/owner/update-alert-preferences/` — updates UserProfile alert fields
- No separate GET endpoint for preferences

**Frontend currently uses:**
- `POST /api/owner/update-alert-preferences/` for both GET and POST (GET returns the data too based on DRF behavior)

---

## 10. Language Preferences
- Stored in `UserProfile.language_preference` (en/hi)
- Updated via `POST /api/owner/update-alert-preferences/`
- Frontend also has local `useLanguageStore` with `en`/`hi`

---

## 11. Theme Preferences
**NOT IN BACKEND.** Frontend manages theme locally via `useThemeStore` with MMKV.

---

## 12. Account Deletion
**NOT IMPLEMENTED** in backend. No delete account endpoint exists.

---

## 13. Session Management
- JWT tokens with `rest_framework_simplejwt` + blacklist
- `POST /auth/logout/` — blacklists provided refresh token
- `POST /auth/logout-all/` — blacklists all outstanding tokens for user
- No session list API
- No device list API

---

## 14. Device Management
- `POST /auth/device/register/` — accepts `{deviceId, deviceModel, deviceName, platform, osVersion, appVersion, buildVersion}`, returns `{message}`
- **No device list, no device delete API**

---

## 15. Subscription APIs

### ViewSets registered at root URL:
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/subscription-plans/` | None | Read-only active plans |
| GET | `/user-subscriptions/` | Required | User's subscription |
| POST | `/user-subscriptions/` | Required | Create/update subscription |
| GET | `/addon-purchases/` | Required | User's add-ons |
| POST | `/addon-purchases/` | Required | Purchase add-on |
| GET | `/usage-limits/` | Required | User's usage limits |

### Bootstrap endpoint (single-call):
`GET /auth/bootstrap/` — returns maintenance, appVersion, and if authenticated:
- user
- subscription (with plan details)
- addOns
- featureLimits
- dashboardSummary

---

## 16. Document APIs

Documents app provides PDF generation endpoints:
- `GET /document/rent_receipt/<id>/pdf_receipt/`
- `GET /document/properties/<id>/generate-dossier-pdf/`
- `GET /document/rent_agreement/<id>/generate-rent-agreement-pdf/`
- `GET /document/income_summary/download/`
- `POST /document/income_summary/send-whatsapp/`

**No general document upload/management API for profile photos.**

---

## 17. Permission APIs
Backend returns `permissions` list in profile serializer (Django permission codenames from user's groups). Frontend maps these to its own permission system.

---

## 18. Audit/History APIs
- `User.history` via `simple_history` — Django admin only, no public API
- No public audit/history API

---

## 19. Error Responses

| Status | When |
|---|---|
| 400 | Validation errors, missing fields |
| 401 | Invalid credentials, expired token |
| 403 | Inactive user, permission denied |
| 404 | Resource not found |
| 409 | Conflict (rare) |
| 429 | Rate limit (OTP, etc.) |
| 500 | Server error |
| 503 | Maintenance mode |

Frontend already has `SecureNestApiError` mapping in `apiClient.ts`.

---

## 20. Missing APIs (Required for Settings Module)

### Critical Missing APIs:
1. **Account Deletion** — No backend endpoint. MUST be added to backend.
2. **Privacy/Data Export** — No backend endpoint. MUST be added to backend.
3. **Device List/Management** — Only register endpoint exists. Need list + delete.
4. **Email Verification** — No backend endpoint. Must be added.
5. **Session List** — No backend endpoint. Must be added or use JWT token introspection.
6. **Profile Photo Upload** — No dedicated endpoint. Must use document upload or add new endpoint.
7. **Theme Preference persistence** — Not in backend (frontend-only is acceptable).

### APIs That Can Be Reused:
- ✅ `GET/PUT /auth/profile/` — Profile
- ✅ `POST /change-password/` — Change password
- ✅ `POST /auth/logout/` + `/auth/logout-all/` — Logout
- ✅ `POST /api/owner/update-alert-preferences/` — Notification/language prefs
- ✅ `GET /subscription-plans/`, `/user-subscriptions/`, `/addon-purchases/`, `/usage-limits/` — Subscription
- ✅ `GET /auth/bootstrap/` — Bootstrap data
- ✅ `POST /auth/device/register/` — Device registration
- ✅ `GET /auth/app/version/`, `/auth/maintenance/` — App info
- ✅ `POST /auth/biometric/setup/` + `/auth/biometric/disable/` — Biometric

---

## 21. Backend Changes Required (To Be Implemented Separately)

### A. Add `DELETE /auth/account/` — Account Deletion
```python
# core/views.py
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    # Soft delete or cascade — business decision
    user.is_active = False
    user.save(update_fields=["is_active"])
    # Blacklist all tokens
    # ... logout all logic
    return Response({"message": "Account deleted"}, status=200)
```

### B. Add `GET /auth/devices/` — Device List
```python
# core/models.py
class Device(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    device_id = models.CharField(max_length=255)
    device_name = models.CharField(max_length=255)
    platform = models.CharField(max_length=20)
    os_version = models.CharField(max_length=50)
    last_active = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### C. Add `DELETE /auth/devices/<id>/` — Remove Device

### D. Add `GET /auth/sessions/` — Session List (optional, uses JWT OutstandingToken)

### E. Add `POST /auth/verify-email/` — Email Verification

### F. Add Profile Photo Upload — Reuse `/upload/image/` or add dedicated endpoint

---

## 22. Frontend Compatibility Notes

1. **Profile photo**: Not supported by backend. Show placeholder or hide.
2. **Company/business name**: Not in User or UserProfile. Hide.
3. **Address**: Not in backend. Hide.
4. **Account creation date**: Not exposed in profile serializer. Hide.
5. **Verification status**: `is_phone_verified` available, email verification not.
6. **MFA/2FA**: Not in backend. Hide MFA settings.
7. **Theme**: Frontend-only (local). No backend sync needed.
8. **Language**: Sync with backend via `/api/owner/update-alert-preferences/` AND local store.
9. **Quiet hours**: Not in backend. Hide.
10. **Push/SMS channels**: Not in `NotificationPreference`. Only WhatsApp + Email are backend-supported.
11. **Data export**: Not in backend. Show "Coming soon" or hide.
12. **Account deletion**: Not in backend. Show as disabled/coming soon.
13. **Devices**: Only register endpoint. Show limited device info or hide.

---

## 23. Frontend Reuse Checklist

| Feature | Existing Frontend Asset | Backend API | Action |
|---|---|---|---|
| Notifications Hub | `src/features/notifications/` | `/api/owner/update-alert-preferences/` | ✅ Reuse directly |
| Theme | `src/theme/ThemeManager.tsx` | None (local) | ✅ Reuse directly |
| Language | `src/store/languageStore.ts` | `/api/owner/update-alert-preferences/` | ✅ Reuse + sync |
| Auth tokens | `src/store/authStore.ts` | `/auth/logout/`, `/auth/logout-all/` | ✅ Reuse directly |
| API client | `src/services/api/apiClient.ts` | All endpoints | ✅ Reuse directly |
| Subscription | `src/store/subscriptionStore.ts` | `/user-subscriptions/` etc. | ✅ Reuse + extend |
| Route guards | `src/navigation/components/` | N/A | ✅ Reuse directly |
| Validation | `src/validations/` | N/A | ✅ Reuse directly |
| Upload | `src/services/api/uploadService.ts` | `/upload/image/` | ✅ Reuse for photos |
