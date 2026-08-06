# RentSecureBE Backend Analysis Report

## Executive Summary

RentSecureBE is a Django 5.2 + DRF + PostgreSQL backend powering the RentSecure property management platform. It exposes a REST API consumed by a React Native/Expo frontend. This report analyzes the backend's readiness for the **Enterprise Renter Management Module** frontend, identifies gaps, and proposes Django-side additions where needed.

---

## 1. Existing Backend APIs

### 1.1 Authentication & Bootstrap

| Path                       | Method  | Purpose                                                                         |
| -------------------------- | ------- | ------------------------------------------------------------------------------- |
| `/auth/send-otp/`          | POST    | Send OTP to phone                                                               |
| `/auth/owner/verify-otp/`  | POST    | Owner OTP login                                                                 |
| `/auth/renter/verify-otp/` | POST    | Renter OTP login                                                                |
| `/auth/login/`             | POST    | Email/password login                                                            |
| `/auth/register/`          | POST    | Register owner/renter                                                           |
| `/auth/social/`            | POST    | Google/Apple social auth                                                        |
| `/auth/profile/`           | GET/PUT | Current user profile                                                            |
| `/auth/logout/`            | POST    | Logout (blacklist refresh)                                                      |
| `/auth/logout-all/`        | POST    | Logout all devices                                                              |
| `/auth/bootstrap/`         | GET     | App bootstrap (maintenance, app version, user, subscription, limits, dashboard) |
| `/auth/app/version/`       | GET     | App version info                                                                |
| `/auth/maintenance/`       | GET     | Maintenance mode                                                                |
| `/token/refresh/`          | POST    | Refresh JWT                                                                     |
| `/forgot-password/`        | POST    | Forgot password                                                                 |
| `/reset-password/<token>/` | POST    | Reset password confirm                                                          |
| `/reset-password/`         | POST    | Reset password (authenticated)                                                  |
| `/change-password/`        | POST    | Change password                                                                 |

### 1.2 Properties / Core Renter APIs

| Path                                          | Method           | ViewSet/Function                | Purpose                                                       |
| --------------------------------------------- | ---------------- | ------------------------------- | ------------------------------------------------------------- |
| `/api/renters/`                               | GET/POST         | `RenterViewSet`                 | List/Create renters (owner-scoped, active/notice_period only) |
| `/api/renters/{id}/`                          | GET/PATCH/DELETE | `RenterViewSet`                 | Retrieve/Update/Delete renter                                 |
| `/api/renters/{id}/rate/`                     | POST             | `RenterViewSet.submit_rating`   | Rate a renter after move-out                                  |
| `/api/renters/{id}/update-status/`            | POST             | `RenterViewSet.update_status`   | Update renter status                                          |
| `/api/renters/{id}/vacate/`                   | POST             | `RenterViewSet.vacate`          | Vacate renter (must be in notice_period)                      |
| `/api/renters/status_summary/`                | GET              | `RenterViewSet.status_summary`  | Status counts for owner                                       |
| `/api/renters/recent_activity/`               | GET              | `RenterViewSet.recent_activity` | Recent renter status changes                                  |
| `/api/buildings/`                             | GET/POST         | `BuildingViewSet`               | List/Create buildings                                         |
| `/api/buildings/{id}/`                        | GET/PATCH/DELETE | `BuildingViewSet`               | Building CRUD                                                 |
| `/api/units/`                                 | GET/POST         | `UnitViewSet`                   | List/Create units                                             |
| `/api/units/{id}/`                            | GET/PATCH/DELETE | `UnitViewSet`                   | Unit CRUD                                                     |
| `/api/units/occupancy_stats/`                 | GET              | `UnitViewSet.occupancy_stats`   | Occupancy stats                                               |
| `/api/unit-images/`                           | GET/POST         | `UnitImageViewSet`              | Unit images                                                   |
| `/api/unit-images/{id}/`                      | GET/PATCH/DELETE | `UnitImageViewSet`              | Image CRUD                                                    |
| `/api/unit-all-documents/`                    | GET/POST         | `UnitDocumentViewSet`           | Unit documents                                                |
| `/api/unit-all-documents/{id}/`               | GET/PATCH/DELETE | `UnitDocumentViewSet`           | Document CRUD                                                 |
| `/api/rent-records/`                          | GET/POST         | `RentRecordViewSet`             | Rent records CRUD                                             |
| `/api/rent-records/{id}/`                     | GET/PATCH/DELETE | `RentRecordViewSet`             | Rent record detail                                            |
| `/api/rent-records/{id}/invoice/`             | GET              | Function view                   | Download rent invoice PDF                                     |
| `/api/rent-records/{id}/pdf_receipt/`         | GET              | `GenerateRentReceiptPdfViewSet` | Download receipt PDF                                          |
| `/api/rent-records/{id}/resend-confirmation/` | POST             | Function view                   | Resend rent confirmation                                      |
| `/api/rent-records/{id}/whatsapp-logs/`       | GET              | Function view                   | WhatsApp logs for rent record                                 |
| `/api/rent-records/monthly_rent_summary/`     | GET              | `RentRecordViewSet`             | Monthly summary                                               |
| `/api/rent-records/itr_summary/`              | GET              | `RentRecordViewSet`             | ITR summary                                                   |
| `/api/rent-records/send_itr_summary/`         | POST             | `RentRecordViewSet`             | Send ITR summary notification                                 |
| `/api/rent-records/download_itr_summary/`     | GET              | `RentRecordViewSet`             | Download ITR summary PDF                                      |
| `/api/rent-records/retry_payout_api/{id}/`    | POST             | Function view                   | Retry failed payout                                           |
| `/api/extra-charges/`                         | GET/POST         | `ExtraChargeViewSet`            | Extra charges CRUD                                            |
| `/api/extra-charges/{id}/`                    | GET/PATCH/DELETE | `ExtraChargeViewSet`            | Extra charge detail                                           |
| `/api/police-verifications/`                  | GET/POST         | `PoliceVerificationViewSet`     | Police verifications                                          |
| `/api/police-verifications/{id}/`             | GET/PATCH/DELETE | `PoliceVerificationViewSet`     | Police verification detail                                    |
| `/api/police-verifications/dashboard_stats/`  | GET              | `PoliceVerificationViewSet`     | Police verification stats                                     |
| `/api/rent-agreements/`                       | GET/POST         | `RentAgreementDraftViewSet`     | Rent agreement drafts                                         |
| `/api/rent-agreements/{id}/`                  | GET/PATCH/DELETE | `RentAgreementDraftViewSet`     | Agreement draft detail                                        |
| `/api/rent-agreement-drafts/`                 | GET/POST         | `RentAgreementDraftViewSet`     | Same as above (alias)                                         |
| `/api/rent-agreement-drafts/{id}/`            | GET/PATCH/DELETE | `RentAgreementDraftViewSet`     | Same as above (alias)                                         |
| `/properties/owner/rent-records/`             | GET              | Function view                   | Owner rent records (legacy)                                   |
| `/properties/renter/rent-due/`                | GET              | Function view                   | Latest due rent for renter                                    |
| `/properties/renter/rent-history/`            | GET              | Function view                   | Renter rent history                                           |
| `/properties/owner/rents/`                    | GET              | Function view                   | Owner rent overview                                           |
| `/properties/owner/dashboard/`                | GET              | Function view                   | Owner dashboard                                               |
| `/properties/owner/dashboard-summary/`        | GET              | Function view                   | Owner dashboard summary                                       |
| `/properties/owner/income-summary/`           | GET              | Function view                   | Owner income summary                                          |
| `/api/owner/update-bank-details/`             | POST             | Function view                   | Update owner bank details                                     |
| `/api/owner/update-alert-preferences/`        | POST             | Function view                   | Update alert preferences                                      |
| `/api/owner/reminder-time/`                   | POST             | `ReminderTimeUpdateView`        | Update reminder time                                          |
| `/api/owner/rent-report/`                     | GET              | Function view                   | Download rent Excel                                           |
| `/owner/ca-summary/`                          | GET              | Function view                   | Download CA summary                                           |
| `/itr/contact-ca/`                            | POST             | Function view                   | Contact CA                                                    |
| `/itr/tracker/`                               | GET              | Function view                   | ITR tracker                                                   |
| `/itr/deduction-suggestions/`                 | GET              | Function view                   | ITR deduction suggestions                                     |
| `/itr/extract-form16/`                        | POST             | Function view                   | Extract Form 16 data                                          |

### 1.3 Payment & Webhook APIs

| Path                          | Method | Purpose                           |
| ----------------------------- | ------ | --------------------------------- |
| `/api/rent/payment-callback/` | POST   | Razorpay webhook                  |
| `/webhook/cashfree/payout/`   | POST   | Cashfree payout webhook           |
| `/api/rent/payment-callback/` | POST   | Razorpay webhook (duplicate path) |

### 1.4 Notification APIs

| Path                               | Method | Purpose                   |
| ---------------------------------- | ------ | ------------------------- |
| `/api/notifications/get/`          | GET    | Get notifications         |
| `/api/notifications/mark/{id}/`    | POST   | Mark notification as read |
| `/api/notifications/save-token/`   | POST   | Save device token         |
| `/api/notifications/register-fcm/` | POST   | Register FCM token        |

### 1.5 Finance APIs

| Path                                   | Method           | Purpose                 |
| -------------------------------------- | ---------------- | ----------------------- |
| `/api/finance/tax-submissions/`        | GET/POST         | Tax submissions CRUD    |
| `/api/finance/tax-submissions/{id}/`   | GET/PATCH/DELETE | Tax submission detail   |
| `/api/finance/tax-summary/download/`   | GET              | Download tax files ZIP  |
| `/api/finance/ca/match/`               | GET              | Get matched CA          |
| `/api/finance/ca/callback-request/`    | POST             | Request CA callback     |
| `/api/finance/ca/leads/`               | GET              | CA leads list           |
| `/api/finance/ca/analytics/`           | GET              | CA analytics            |
| `/api/finance/ca/leads/{id}/update/`   | POST             | Update lead status      |
| `/api/finance/ca/leads/{id}/whatsapp/` | POST             | Send WhatsApp follow-up |

### 1.6 Document APIs

| Path                                                                   | Method | Purpose                          |
| ---------------------------------------------------------------------- | ------ | -------------------------------- |
| `/documents/document/rent_receipt/{id}/pdf_receipt/`                   | GET    | Rent receipt PDF                 |
| `/documents/document/properties/{id}/generate-dossier-pdf/`            | GET    | Unit dossier PDF                 |
| `/documents/document/rent_agreement/{id}/generate-rent-agreement-pdf/` | GET    | Rent agreement PDF               |
| `/documents/document/income_summary/download/`                         | GET    | Income summary PDF               |
| `/documents/document/income_summary/send-whatsapp/`                    | POST   | Send income summary via WhatsApp |

### 1.7 Subscription APIs

| Path                            | Method           | Purpose                        |
| ------------------------------- | ---------------- | ------------------------------ |
| `/api/subscription-plans/`      | GET              | List active subscription plans |
| `/api/user-subscriptions/`      | GET/POST         | User subscription CRUD         |
| `/api/user-subscriptions/{id}/` | GET/PATCH/DELETE | Subscription detail            |
| `/api/addon-purchases/`         | GET/POST         | Add-on purchases CRUD          |
| `/api/addon-purchases/{id}/`    | GET/PATCH/DELETE | Add-on detail                  |
| `/api/usage-limits/`            | GET              | Usage limits for current user  |

### 1.8 Core APIs

| Path                        | Method | Purpose                                     |
| --------------------------- | ------ | ------------------------------------------- |
| `/api/plan-feature-limits/` | GET    | Plan feature limits (commented out in urls) |
| `/tax/tax-report/`          | GET    | Download tax report PDF                     |
| `/tax/tax-saving-tips/`     | GET    | Tax saving tips                             |

---

## 2. Existing Serializers

| Serializer                      | Model                 | Purpose                              |
| ------------------------------- | --------------------- | ------------------------------------ |
| `UserSerializer`                | `User`                | User basic info + role + permissions |
| `ProfileSerializer`             | `User`                | Profile (same as UserSerializer)     |
| `LoginSerializer`               | (custom)              | Login validation                     |
| `RegisterSerializer`            | (custom)              | Registration validation              |
| `SocialAuthSerializer`          | (custom)              | Social auth validation               |
| `ForgotPasswordSerializer`      | (custom)              | Forgot password validation           |
| `ResetPasswordSerializer`       | (custom)              | Reset password validation            |
| `DeviceInfoSerializer`          | (custom)              | Device info validation               |
| `SubscriptionPlanSerializer`    | `SubscriptionPlan`    | Subscription plan                    |
| `UserSubscriptionSerializer`    | `UserSubscription`    | User subscription                    |
| `AddOnPurchaseSerializer`       | `AddOnPurchase`       | Add-on purchase                      |
| `PlanFeatureLimitSerializer`    | `PlanFeatureLimit`    | Plan feature limits                  |
| `UsageLimitSerializer`          | `UsageLimit`          | Usage limits                         |
| `BuildingSerializer`            | `Building`            | Building with nested units           |
| `UnitSerializer`                | `Unit`                | Unit CRUD                            |
| `UnitImageSerializer`           | `UnitImage`           | Unit image                           |
| `UnitDocumentSerializer`        | `UnitDocument`        | Unit document                        |
| `RentAgreementDraftSerializer`  | `RentAgreementDraft`  | Rent agreement draft                 |
| `RenterSerializer`              | `Renter`              | Renter CRUD                          |
| `RenterRentRecordSerializer`    | `RentRecord`          | Renter's rent record summary         |
| `RentRecordSerializer`          | `RentRecord`          | Rent record CRUD                     |
| `ExtraChargeSerializer`         | `ExtraCharge`         | Extra charge CRUD                    |
| `PoliceVerificationSerializer`  | `PoliceVerification`  | Police verification                  |
| `CAConnectionRequestSerializer` | `CAConnectionRequest` | CA connection request                |
| `CAProfileSerializer`           | `CAProfile`           | CA profile                           |
| `TaxSubmissionToCASerializer`   | `TaxSubmissionToCA`   | Tax submission to CA                 |

---

## 3. Existing Permissions

| Class/Mechanism                                           | Where Used                                                                      | Purpose                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------ |
| `IsAuthenticated`                                         | Almost all views                                                                | Must be logged in              |
| `AllowAny`                                                | Auth, bootstrap, app version, maintenance, subscription plans                   | Public access                  |
| Owner check via `unit.owner == request.user`              | Renter, Unit, RentRecord, ExtraCharge views                                     | Resource-level ownership       |
| Building owner check via `building.owner == request.user` | Unit create/update                                                              | Ensure user owns building      |
| `FeatureEnforcer.can_create()`                            | Renter, Unit, RentRecord, Building, UnitImage, UnitDocument, RentAgreementDraft | Subscription/quota enforcement |
| `check_feature_limit()`                                   | RenterViewSet.create                                                            | Legacy feature limit check     |

---

## 4. Existing Validations

| Model/Serializer                          | Validation                                                                                  | Where       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | ----------- |
| `Renter.clean()`                          | end_date >= start_date; only one active/notice_period renter per unit                       | Model clean |
| `Unit.clean()`                            | Latitude [-90, 90]; longitude [-180, 180]                                                   | Model clean |
| `PoliceVerification.clean()`              | renter.unit == unit                                                                         | Model clean |
| `RentAgreementDraft.clean()`              | renter.unit == unit                                                                         | Model clean |
| `RentRecord.clean()`                      | amount >= 0                                                                                 | Model clean |
| `RenterSerializer.validate()`             | unit.owner == request.user                                                                  | Serializer  |
| `UnitSerializer.validate()`               | building.owner == request.user; lat/lng bounds                                              | Serializer  |
| `RentRecordSerializer.validate()`         | unit ownership; renter ownership; renter.unit == unit; amount >= 0; rent_month >= date_paid | Serializer  |
| `ExtraChargeSerializer.validate()`        | renter.unit == unit; unit ownership; amount >= 0                                            | Serializer  |
| `RentAgreementDraftSerializer.validate()` | renter.unit == unit; unit ownership                                                         | Serializer  |

---

## 5. Existing Business Rules

1. **Ownership**: All property mutations require `resource.owner == request.user`.
2. **Renter Status Lifecycle**: `active` → `notice_period` → `deactivated` or `revoked`.
3. **Renter Uniqueness**: `phone` unique per `unit`.
4. **Unit Occupancy**: Auto-synced via `update_unit_status()` when renters change.
5. **Feature Limits**: `max_buildings`, `max_units`, `max_renters`, `max_caretakers`, `max_unit_images`, `max_document_uploads`, `rent_agreement_drafts`, `rent_records` enforced via `FeatureEnforcer` and `UsageLimit`.
6. **Subscription Grace Period**: 7 days after expiry before falling back to free plan limits.
7. **Caching**: Buildings (5 min), units (5 min), renters (5 min), rent records (5 min), rent drafts (5 min), unit images (5 min), unit documents (5 min).
8. **Rent Payment Flow**: Create RentRecord → generate Razorpay payment link → send WhatsApp to renter → webhook updates status → Cashfree payout → payout notification.
9. **Agreement Signing**: RentAgreementDraft created → sent to Leegality for digital signature → webhook updates `owner_signed`/`renter_signed`.
10. **Police Verification**: Status tracked (`not_started`, `submitted`, `verified`); file uploaded; linked to renter+unit.
11. **Simple History**: All major models use `simple_history` for audit trail.
12. **Signals**: `renter_exited`, `renter_archived` signals exist but are not wired to any receivers in the inspected code.
13. **WhatsApp Notifications**: All notifications use Twilio WhatsApp API; messages are logged to `WhatsAppLog`.
14. **OCR**: PDF OCR service exists (`extract_pdf_text`, `extract_form16_data`) but is only used for ITR/Form16 extraction, not for KYC documents.
15. **Onboarding**: Renter onboarding via WhatsApp invite with secure token link.

---

## 6. Missing APIs

### 6.1 Critical Missing APIs (Blocking Frontend Features)

| Feature                              | Missing API                                                                                                                                                                                              | Impact                                                                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **KYC Document Management**          | No dedicated KYC document model/serializer/view. Renter only has single `id_proof` file field. No document type classification, no OCR for KYC, no expiry tracking, no per-document verification status. | Cannot build KYC Verification screen with Aadhaar/PAN/Passport/Driving License/Voter ID support. |
| **Police Verification Enhancements** | `PoliceVerification` model lacks `verification_number`, `expiry_date`, `reminder_enabled` fields. No dedicated reminder notification endpoint. No status history tracking.                               | Cannot fully implement Police Verification screen with expiry tracking and reminders.            |
| **Renter Activity Timeline**         | No dedicated timeline endpoint for a renter. `simple_history` exists but no API to retrieve it per renter.                                                                                               | Cannot build Activity Timeline screen.                                                           |
| **Renter Documents**                 | No dedicated endpoint for renter documents beyond the single `id_proof` and `rent_agreement` on Renter model.                                                                                            | Cannot build Documents screen with multiple document types.                                      |
| **Emergency Contacts**               | Renter has `emergency_contact_name` and `emergency_contact_number` but no dedicated API endpoint to manage them separately (e.g., add multiple contacts).                                                | Limited to single emergency contact.                                                             |
| **Renter Notes**                     | Renter has `notes` field but no dedicated notes API (create/update/list notes separately).                                                                                                               | Cannot build Notes screen with audit trail.                                                      |
| **Search**                           | No global search endpoint. `RenterViewSet` doesn't implement `SearchFilter` or `OrderingFilter`.                                                                                                         | Cannot implement search by name/phone/email/unit/building/agreement.                             |
| **Filters**                          | No filter backend configured on `RenterViewSet`.                                                                                                                                                         | Cannot implement advanced filters.                                                               |
| **Bulk Operations**                  | No bulk import/export/assign/delete endpoints for renters.                                                                                                                                               | Cannot implement bulk operations.                                                                |
| **Renter Profile**                   | No dedicated renter profile screen endpoint for renter users to view their own info.                                                                                                                     | Renter users cannot view their own profile details.                                              |
| **Unit Transfer**                    | No dedicated unit transfer endpoint.                                                                                                                                                                     | Cannot implement Transfer Unit feature.                                                          |

### 6.2 Missing APIs - Detail & Suggested Django Implementation

#### 6.2.1 KYC Document Model

**What is missing:**

- Dedicated `KYCDocument` model with `document_type` choices (Aadhaar, PAN, Passport, Driving License, Voter ID, Other)
- Per-document fields: `document_number`, `file`, `expiry_date`, `is_verified`, `verified_at`, `ocr_data`
- Serializer with validation for document types
- ViewSet with CRUD + custom actions for OCR extraction, preview, download
- URL routing

**Why it is required:**
The frontend needs to support multiple KYC document types per renter, with upload, preview, replace, delete, download, and OCR capabilities. The current single `id_proof` field is insufficient.

**Suggested Django implementation:**

```python
# properties/models/renter_models.py

class KYCDocument(models.Model):
    class DocumentType(models.TextChoices):
        AADHAAR = "aadhaar", "Aadhaar"
        PAN = "pan", "PAN"
        PASSPORT = "passport", "Passport"
        DRIVING_LICENSE = "driving_license", "Driving License"
        VOTER_ID = "voter_id", "Voter ID"
        OTHER = "other", "Other"

    class VerificationStatus(models.TextChoices):
        NOT_STARTED = "not_started", "Not Started"
        IN_PROGRESS = "in_progress", "In Progress"
        VERIFIED = "verified", "Verified"
        REJECTED = "rejected", "Rejected"

    id = models.AutoField(primary_key=True)
    renter = models.ForeignKey(
        "Renter", on_delete=models.CASCADE, related_name="kyc_documents", db_index=True
    )
    document_type = models.CharField(
        max_length=50, choices=DocumentType.choices, db_index=True
    )
    document_number = models.CharField(
        max_length=100, blank=True, help_text="Document number (e.g., PAN, Aadhaar)"
    )
    file = models.FileField(upload_to="kyc_documents/")
    file_hash = models.CharField(max_length=64, editable=False, db_index=True)
    expiry_date = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_kyc_documents",
    )
    ocr_data = models.JSONField(null=True, blank=True, help_text="Extracted OCR data")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    history = HistoricalRecords(user_model=settings.AUTH_USER_MODEL)

    class Meta:
        unique_together = ("renter", "document_type")
        ordering = ["-uploaded_at"]
        indexes = [
            models.Index(fields=["renter", "document_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.renter.name} - {self.get_document_type_display()}"

    def clean(self) -> None:
        if self.document_number and self.document_type == self.DocumentType.PAN:
            import re
            if not re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]$', self.document_number):
                raise ValidationError("Invalid PAN number format.")
        if self.document_type == self.DocumentType.AADHAAR and self.document_number:
            import re
            if not re.match(r'^\d{12}$', self.document_number):
                raise ValidationError("Invalid Aadhaar number format.")
```

```python
# properties/serializers/kyc_serializers.py

class KYCDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYCDocument
        fields = "__all__"
        read_only_fields = ["renter", "file_hash", "verified_at", "verified_by", "ocr_data"]

    def validate(self, data):
        user = self.context["request"].user
        renter = data.get("renter") or getattr(self.instance, "renter", None)
        if renter and renter.unit.owner != user:
            raise serializers.ValidationError("You do not own this renter.")
        return data

    def create(self, validated_data):
        validated_data["renter"] = self.context["renter"]
        return super().create(validated_data)
```

```python
# properties/views/kyc_views.py

class KYCDocumentViewSet(viewsets.ModelViewSet[KYCDocument]):
    serializer_class = KYCDocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return KYCDocument.objects.filter(renter__unit__owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=["post"], url_path="ocr")
    def extract_ocr(self, request, pk=None):
        kyc_doc = self.get_object()
        from properties.services.ocr_service import extract_pdf_text, extract_pan
        text = extract_pdf_text(kyc_doc.file)
        ocr_data = {"raw_text": text}
        if kyc_doc.document_type == KYCDocument.DocumentType.PAN:
            ocr_data["pan_number"] = extract_pan(text)
        kyc_doc.ocr_data = ocr_data
        kyc_doc.save(update_fields=["ocr_data"])
        return Response({"ocr_data": ocr_data})

    @action(detail=True, methods=["get"], url_path="preview")
    def preview(self, request, pk=None):
        kyc_doc = self.get_object()
        # Return file URL or presigned URL
        return Response({"url": kyc_doc.file.url, "name": kyc_doc.file.name})

    @action(detail=True, methods=["get"], url_path="download")
    def download(self, request, pk=None):
        kyc_doc = self.get_object()
        return FileResponse(kyc_doc.file.open(), as_attachment=True, filename=os.path.basename(kyc_doc.file.name))
```

```python
# properties/urls.py additions
router.register(r"kyc-documents", KYCDocumentViewSet, basename="kyc-documents")
```

#### 6.2.2 Police Verification Enhancements

**What is missing:**

- `verification_number` field
- `expiry_date` field
- Reminder notification endpoint
- Status history tracking

**Why it is required:**
Police verification expiry tracking and reminder notifications are needed for compliance.

**Suggested Django implementation:**

```python
# properties/models/renter_models.py additions

class PoliceVerification(models.Model):
    # ... existing fields ...
    verification_number = models.CharField(max_length=100, blank=True, db_index=True)
    expiry_date = models.DateField(null=True, blank=True)
    reminder_sent_at = models.DateTimeField(null=True, blank=True)
    reminder_enabled = models.BooleanField(default=True)
    # ... existing fields ...
```

```python
# properties/views/police_verification_views.py additions

@action(detail=True, methods=["post"], url_path="send-reminder")
def send_reminder(self, request, pk=None):
    pv = self.get_object()
    if not pv.reminder_enabled:
        return Response({"error": "Reminders disabled"}, status=400)
    # Send reminder via WhatsApp/notification
    from notification.services.whatsapp_service import send_whatsapp_message
    message = f"Your police verification for {pv.renter.unit.unit} is expiring on {pv.expiry_date}."
    send_whatsapp_message(pv.renter.phone, message, user=pv.renter.user)
    pv.reminder_sent_at = timezone.now()
    pv.save(update_fields=["reminder_sent_at"])
    return Response({"message": "Reminder sent"})
```

#### 6.2.3 Renter Activity Timeline

**What is missing:**

- No endpoint to retrieve `simple_history` entries for a specific renter.

**Suggested Django implementation:**

```python
# properties/views/renter_views.py additions

@action(detail=True, methods=["get"], url_path="timeline")
def timeline(self, request, pk=None):
    renter = self.get_object()
    history = renter.history.all().select_related("history_user")[:50]
    data = [
        {
            "id": h.id,
            "action": "updated" if h.history_type == "~" else h.history_type,
            "description": f"{h.history_type} renter: {renter.name}",
            "timestamp": h.history_date,
            "user": h.history_user.full_name if h.history_user else "System",
            "changes": h.diff_against(h.prev_record).changes if h.prev_record else [],
        }
        for h in history
    ]
    return Response(data)
```

#### 6.2.4 Renter Notes API

**What is missing:**

- No dedicated notes endpoint.

**Suggested Django implementation:**
The existing `Renter.notes` field is a single text field. For a notes system with audit trail:

```python
# properties/models/renter_models.py

class RenterNote(models.Model):
    renter = models.ForeignKey(Renter, on_delete=models.CASCADE, related_name="renter_notes")
    note = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    history = HistoricalRecords(user_model=settings.AUTH_USER_MODEL)

    class Meta:
        ordering = ["-created_at"]

# properties/views/renter_views.py

@action(detail=True, methods=["get", "post"], url_path="notes")
def notes(self, request, pk=None):
    renter = self.get_object()
    if request.method == "GET":
        notes = renter.renter_notes.all().select_related("created_by")
        data = [
            {
                "id": n.id,
                "note": n.note,
                "created_by": n.created_by.full_name,
                "created_at": n.created_at,
            }
            for n in notes
        ]
        return Response(data)
    note = renter.renter_notes.create(note=request.data.get("note"), created_by=request.user)
    return Response({"id": note.id, "note": note.note, "created_at": note.created_at}, status=201)
```

#### 6.2.5 Search & Filters

**What is missing:**

- `SearchFilter` and `OrderingFilter` not configured on `RenterViewSet`.
- No search by name, phone, email, unit number, building name, agreement number.

**Suggested Django implementation:**

```python
# properties/views/renter_views.py

from rest_framework import filters

class RenterViewSet(viewsets.ModelViewSet[Renter]):
    # ...
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "email", "phone", "unit__unit", "unit__building__name", "rent_agreement"]
    ordering_fields = ["name", "start_date", "rent_amount", "status", "created_at"]
    ordering = ["-start_date"]
```

#### 6.2.6 Bulk Operations

**What is missing:**

- No bulk import/export endpoints.

**Suggested Django implementation:**
Use Django import-export or pandas for CSV/Excel export. For import, use a serializer with `many=True`.

```python
# properties/views/renter_views.py

@action(detail=False, methods=["post"], url_path="bulk-import")
def bulk_import(self, request):
    file = request.FILES.get("file")
    if not file:
        return Response({"error": "File required"}, status=400)
    # Parse CSV/Excel
    df = pd.read_excel(file) if file.name.endswith(".xlsx") else pd.read_csv(file)
    renters_created = []
    errors = []
    for idx, row in df.iterrows():
        try:
            unit = Unit.objects.get(unit=row["unit"], owner=request.user)
            renter = Renter.objects.create(
                unit=unit,
                name=row["name"],
                email=row.get("email", ""),
                phone=row["phone"],
                rent_amount=row["rent_amount"],
                start_date=row["start_date"],
            )
            renters_created.append(renter.id)
        except Exception as e:
            errors.append({"row": idx + 2, "error": str(e)})
    return Response({"created": renters_created, "errors": errors})
```

#### 6.2.7 Renter Profile for Renter Users

**What is missing:**

- No endpoint for renter users to view their own profile details.

**Suggested Django implementation:**
Add to `renter_views.py` or `core/views.py`:

```python
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def renter_profile(request):
    renter = Renter.objects.filter(user=request.user).first()
    if not renter:
        return Response({"error": "Renter profile not found"}, status=404)
    serializer = RenterSerializer(renter)
    return Response(serializer.data)
```

#### 6.2.8 Unit Transfer

**What is missing:**

- No dedicated unit transfer endpoint.

**Suggested Django implementation:**

```python
# properties/views/renter_views.py

@action(detail=True, methods=["post"], url_path="transfer-unit")
def transfer_unit(self, request, pk=None):
    renter = self.get_object()
    new_unit_id = request.data.get("new_unit_id")
    if not new_unit_id:
        return Response({"error": "new_unit_id required"}, status=400)
    try:
        new_unit = Unit.objects.get(id=new_unit_id, owner=request.user)
    except Unit.DoesNotExist:
        return Response({"error": "Unit not found"}, status=404)
    if new_unit.renters.filter(status__in=["active", "notice_period"]).exists():
        return Response({"error": "Unit already has an active renter"}, status=409)
    old_unit = renter.unit
    renter.unit = new_unit
    renter.save()
    update_unit_status(old_unit)
    update_unit_status(new_unit)
    return Response({"message": "Unit transferred successfully"})
```

---

## 7. Missing Serializers

| Missing Serializer           | Model         | Purpose             |
| ---------------------------- | ------------- | ------------------- |
| `KYCDocumentSerializer`      | `KYCDocument` | KYC document CRUD   |
| `RenterNoteSerializer`       | `RenterNote`  | Renter notes CRUD   |
| `RenterTimelineSerializer`   | (custom)      | Activity timeline   |
| `RenterSearchSerializer`     | (custom)      | Search results      |
| `BulkImportResultSerializer` | (custom)      | Bulk import results |

---

## 8. Missing Permissions

| Missing Permission     | Purpose                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `IsOwnerOrReadOnly`    | Allow read-only access to non-owners (not currently needed since all property APIs require auth) |
| `CanManageRenters`     | Permission codename for renter CRUD (could be group-based)                                       |
| `CanVerifyKYC`         | Permission for KYC verification (owner or admin)                                                 |
| `CanViewRenterHistory` | Permission to view renter history/timeline                                                       |

---

## 9. Missing Validations

| Missing Validation                  | Where                               | Why                                                |
| ----------------------------------- | ----------------------------------- | -------------------------------------------------- |
| Document type uniqueness per renter | `KYCDocument`                       | Prevent duplicate KYC documents of same type       |
| Document number format validation   | `KYCDocument`                       | Aadhaar (12 digits), PAN (5L4D3C), Passport (1L4N) |
| File type validation                | `KYCDocument`, `PoliceVerification` | Restrict to PDF/JPG/PNG                            |
| File size validation                | `KYCDocument`, `PoliceVerification` | Max 5MB per file                                   |
| Expiry date validation              | `KYCDocument`                       | Warn if document expiring within 30 days           |
| Duplicate file hash check           | `KYCDocument`                       | Prevent duplicate uploads                          |
| Renter transfer conflict validation | Unit transfer                       | Prevent transferring to occupied unit              |

---

## 10. Missing Business Rules

| Rule                                  | Description                                                  | Priority |
| ------------------------------------- | ------------------------------------------------------------ | -------- |
| **KYC document expiry alerts**        | Alert owner/renter 30 days before KYC document expiry        | High     |
| **Police verification expiry alerts** | Alert owner/renter 30 days before police verification expiry | High     |
| **Renter auto-flagging**              | Auto-flag renter after 3 missed rents (signals not wired)    | High     |
| **Agreement expiry alerts**           | Alert 30 days before rent agreement expiry                   | Medium   |
| **Unit transfer history**             | Track all unit transfers with reason and date                | Medium   |
| **Renter onboarding token expiry**    | Expire onboarding tokens after 7 days                        | Medium   |
| **Bulk operation limits**             | Limit bulk operations to 100 records per request             | Low      |
| **Soft delete for renters**           | Instead of hard delete, soft-delete renters                  | Low      |

---

## 11. Security Improvements

| Issue                                     | Current State                                      | Recommendation                                                 |
| ----------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| **No rate limiting on OTP**               | 5 requests/hour per phone+IP (exists in `SendOTP`) | Add rate limiting to all mutation endpoints                    |
| **No file type validation**               | Files uploaded without type checking               | Add MIME type validation to all upload endpoints               |
| **No file size limits**                   | No explicit file size validation                   | Add 5MB limit to document uploads                              |
| **Webhook secrets in settings**           | Required but no fallback                           | Add webhook secret rotation mechanism                          |
| **No audit log for sensitive operations** | simple_history exists but not comprehensive        | Add dedicated audit log for payment, KYC, agreement operations |
| **No request signing**                    | No request integrity checks                        | Consider adding signed requests for sensitive operations       |
| **SQL injection**                         | Django ORM protects, but raw queries may exist     | Audit all raw SQL usage                                        |
| **CORS**                                  | Configurable via env                               | Ensure production CORS is locked down                          |
| **CSRF**                                  | Webhook endpoints exempt (correct)                 | Ensure all other endpoints have CSRF protection                |
| **JWT token lifetime**                    | Access: 5 min, Refresh: 35 days                    | Consider shorter refresh token lifetime                        |

---

## 12. Database Optimizations

| Area                           | Current State                                 | Recommendation                                                                 |
| ------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------ |
| **Renter queryset**            | Only active/notice_period returned by default | Add `include_deactivated` query param for full history                         |
| **RentRecord queries**         | `select_related("unit", "renter")` used       | Add `prefetch_related` for related data                                        |
| **PoliceVerification queries** | No `select_related`                           | Add `select_related("renter__unit")`                                           |
| **N+1 queries**                | Risk in nested serializers                    | Audit and fix N+1 in list views                                                |
| **Missing indexes**            | `RentRecord.due_date` has index               | Add index on `Renter.status`, `RentRecord.status`, `PoliceVerification.status` |
| **Cache invalidation**         | Manual cache deletion                         | Consider Django signals for automatic invalidation                             |

---

## 13. Performance Improvements

| Area                 | Current State                    | Recommendation                                           |
| -------------------- | -------------------------------- | -------------------------------------------------------- |
| **List pagination**  | No pagination on `RenterViewSet` | Add `PageNumberPagination` with page_size=20             |
| **Large exports**    | No streaming for bulk exports    | Use ` StreamingHttpResponse` for large CSV/Excel exports |
| **PDF generation**   | Synchronous (WeasyPDF)           | Move to Celery task for async PDF generation             |
| **WhatsApp sending** | Synchronous in views             | Move to Celery task for async notification sending       |
| **OCR extraction**   | Synchronous                      | Move to Celery task for async OCR processing             |
| **Cache warming**    | Cold cache on first request      | Add cache warming on app startup or periodic refresh     |

---

## 14. Swagger / OpenAPI

**Status:** No Swagger/OpenAPI documentation found in the backend.

**Recommendation:** Add `drf-spectacular` to generate OpenAPI schema. This will enable:

- Frontend type generation from API schema
- Interactive API documentation
- Automated contract testing

```python
# settings.py additions
INSTALLED_APPS += ["drf_spectacular"]
REST_FRAMEWORK["DEFAULT_SCHEMA_CLASS"] = "drf_spectacular.openapi.AutoSchema"

# urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView
urlpatterns += [
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularRedocView.as_view(url_name="schema"), name="docs"),
]
```

---

## 15. Missing Django Models Summary

| Model                  | Purpose                                       | Priority     |
| ---------------------- | --------------------------------------------- | ------------ |
| `KYCDocument`          | Multi-type KYC documents with OCR             | **Critical** |
| `RenterNote`           | Notes with audit trail                        | High         |
| `RenterDocument`       | Additional renter documents (beyond id_proof) | Medium       |
| `RenterTransferLog`    | Track unit transfers                          | Medium       |
| `AgreementReminderLog` | Track agreement expiry reminders              | Low          |

---

## 16. Missing Django Services Summary

| Service                      | Purpose                                                            | Priority     |
| ---------------------------- | ------------------------------------------------------------------ | ------------ |
| `kyc_service.py`             | KYC document management, validation, OCR                           | **Critical** |
| `renter_timeline_service.py` | Build renter activity timeline from history                        | High         |
| `renter_search_service.py`   | Search renters by name, phone, email, unit, building               | High         |
| `bulk_operations_service.py` | Bulk import/export/assign/delete                                   | Medium       |
| `reminder_service.py`        | Agreement expiry, KYC expiry, police verification expiry reminders | Medium       |

---

## 17. Missing Django Signals Summary

| Signal                         | Purpose                                             | Priority |
| ------------------------------ | --------------------------------------------------- | -------- |
| `renter_created`               | Send onboarding invite, notify owner                | High     |
| `renter_updated`               | Update unit status, invalidate cache                | High     |
| `renter_deleted`               | Update unit status, decrement quota                 | High     |
| `kyc_document_uploaded`        | Trigger OCR, notify owner                           | Medium   |
| `kyc_verified`                 | Update renter kyc_status, notify renter             | Medium   |
| `police_verification_expiring` | Send reminder notification                          | Medium   |
| `agreement_expiring`           | Send reminder notification                          | Medium   |
| `payment_received`             | Send receipt, thank-you message, update unit status | High     |

---

## 18. Recommended Implementation Order

### Phase 1: Critical (Blocking Frontend)

1. Add `KYCDocument` model, serializer, viewset, URLs
2. Add KYC OCR service integration
3. Add `verification_number` and `expiry_date` to `PoliceVerification`
4. Add `RenterViewSet` search and ordering filters
5. Add renter timeline action

### Phase 2: High Priority

1. Add `RenterNote` model and endpoint
2. Wire `renter_created`, `renter_updated`, `renter_deleted` signals
3. Add unit transfer endpoint
4. Add renter profile endpoint for renter users
5. Add pagination to list views

### Phase 3: Medium Priority

1. Add bulk import/export endpoints
2. Add reminder service for KYC, police verification, agreement expiry
3. Add `RenterDocument` model
4. Add OpenAPI documentation
5. Move heavy operations to Celery

---

## 19. Frontend Compatibility Matrix

| Frontend Feature    | Backend Status | Notes                                                |
| ------------------- | -------------- | ---------------------------------------------------- |
| Renter List         | ✅ Supported   | `GET /api/renters/`                                  |
| Renter Details      | ✅ Supported   | `GET /api/renters/{id}/`                             |
| Add Renter          | ✅ Supported   | `POST /api/renters/`                                 |
| Edit Renter         | ✅ Supported   | `PATCH /api/renters/{id}/`                           |
| Delete Confirmation | ✅ Supported   | `DELETE /api/renters/{id}/`                          |
| Assign Unit         | ⚠️ Partial     | Unit is set on creation; no explicit assign endpoint |
| Transfer Unit       | ❌ Missing     | No transfer endpoint                                 |
| KYC Verification    | ❌ Missing     | Only single `id_proof`; no multi-document KYC        |
| Police Verification | ⚠️ Partial     | CRUD exists but missing expiry, reminders            |
| Emergency Contacts  | ⚠️ Partial     | Single contact fields only                           |
| Documents           | ⚠️ Partial     | Only `id_proof` and `rent_agreement`                 |
| Payment History     | ✅ Supported   | `GET /api/rent-records/`                             |
| Rent History        | ✅ Supported   | `GET /properties/renter/rent-history/`               |
| Agreement History   | ✅ Supported   | `GET /api/rent-agreements/`                          |
| Activity Timeline   | ❌ Missing     | No timeline endpoint                                 |
| Notifications       | ✅ Supported   | `GET /api/notifications/get/`                        |
| Notes               | ❌ Missing     | No dedicated notes endpoint                          |
| Profile             | ⚠️ Partial     | `GET /auth/profile/` but not renter-specific         |

---

## 20. Conclusion

The RentSecureBE backend provides a solid foundation for the Renter Management Module with existing APIs for basic CRUD, rent records, police verification, and agreements. However, several critical features required by the frontend specification are missing at the API level:

1. **Multi-document KYC system** (Aadhaar, PAN, Passport, etc.)
2. **Renter activity timeline**
3. **Search and filter infrastructure**
4. **Bulk operations**
5. **Unit transfer**
6. **Notes management**

These gaps should be addressed in Phase 1 before or alongside the frontend implementation. The recommended Django implementations are provided above and can be implemented within 2-3 days by a backend engineer.

The frontend should be built to gracefully handle missing APIs by showing appropriate empty states, upgrade CTAs, or disabled actions until the backend endpoints are available.
