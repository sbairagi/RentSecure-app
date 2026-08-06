# RentSecureBE Backend Analysis Report

> **Analysis Date:** 2026-08-07
> **Analyst:** Kilo
> **Scope:** Enterprise Document Management System compatibility

---

## 1. Executive Summary

RentSecureBE is a Django 4.2 + DRF backend with no dedicated Enterprise Document Management API. Existing document handling is fragmented across property-specific models (`UnitDocument`, `UnitImage`, `RentAgreementDraft`, `Renter`, `PoliceVerification`, `ArchivedRenter`) and PDF-generation viewsets. **A new generic Document Management API must be added to the backend before the frontend module can be fully integrated.**

---

## 2. Backend Architecture Overview

| Aspect | Detail |
|--------|--------|
| Framework | Django 4.2.30 |
| API | Django REST Framework 3.16.0 |
| Auth | JWT via `rest_framework_simplejwt` |
| Storage | Local filesystem (`MEDIA_ROOT`) by default; AWS S3 env vars exist but `django-storages` is **not** in requirements |
| Permissions | `IsAuthenticated`; ownership checks via `unit.owner == request.user` |
| Feature Limits | `FeatureEnforcer` + `UsageLimit` + `PlanFeatureLimit` + `AddOnPurchase` |
| PDF Generation | WeasyPrint + pypdf |
| OCR | pdfplumber (only for Form 16 / rent receipts) |
| Image Handling | Pillow |
| Caching | Django `locmem` cache (5 min timeout) |
| File Deduplication | SHA256 hash on `UnitDocument` and `UnitImage` only |

---

## 3. Existing Document-Related Models

| Model | App | File Field | Upload Path | Deduplication | Notes |
|-------|-----|------------|-------------|---------------|-------|
| `UnitDocument` | properties | `document` (FileField) | `unit_documents/` | Yes (`file_hash`) | Bound to a `Unit` |
| `UnitImage` | properties | `image` (ImageField) | `unit_images/` | Yes (`image_hash`) | Bound to a `Unit` |
| `RentAgreementDraft` | properties | `file` (FileField) | `auto_agreements/` | No | Bound to `Renter` + `Unit` |
| `Renter` | properties | `id_proof` (FileField) | `id_proofs/renter/` | No | Bound to `Unit` |
| `Renter` | properties | `rent_agreement` (FileField) | `agreements/` | No | Bound to `Unit` |
| `PoliceVerification` | properties | `file` (FileField) | `rent_agreements/` | No | Bound to `Renter` + `Unit` |
| `ArchivedRenter` | properties | `agreement_pdf`, `police_pdf`, `final_invoice` | `archived/*/` | No | Read-only archive |

**Missing:** A generic, standalone `Document` model that supports folders, favorites, archive, sharing, versions, metadata, thumbnails, and MIME-type/size validation.

---

## 4. Existing API Endpoints

| Method | URL | View | Description |
|--------|-----|------|-------------|
| GET | `/document/rent_agreement/<pk>/generate-rent-agreement-pdf/` | `GenerateRentAgreementPdfViewSet` | Generate rent agreement PDF |
| GET | `/document/properties/<pk>/generate-dossier-pdf/` | `GenerateUnitDossierPdfViewSet` | Generate property dossier PDF |
| GET | `/document/rent_receipt/<pk>/pdf_receipt/` | `GenerateRentReceiptPdfViewSet` | Generate rent receipt PDF |
| GET | `/document/income_summary/download/` | `GenerateIncomeSummaryPdfViewSet` | Download income summary PDF |
| POST | `/document/income_summary/send-whatsapp/` | `GenerateIncomeSummaryPdfViewSet` | Send income summary via WhatsApp |
| CRUD | `/properties/unit-images/` | `UnitImageViewSet` | Unit images CRUD |
| CRUD | `/properties/unit-all-documents/` | `UnitDocumentViewSet` | Unit documents CRUD |
| CRUD | `/properties/rent-agreements/` | `RentAgreementDraftViewSet` | Rent agreement drafts CRUD |

**Missing generic endpoints:**
- `POST /documents/upload/` — Generic multipart upload
- `GET /documents/` — List with search/filter/sort
- `GET /documents/<id>/` — Retrieve metadata
- `PATCH /documents/<id>/` — Rename / move metadata update
- `DELETE /documents/<id>/` — Soft delete / archive
- `POST /documents/<id>/download/` — Signed download URL or stream
- `POST /documents/<id>/preview/` — Signed preview URL
- `POST /documents/<id>/share/` — Generate share link
- `POST /documents/<id>/favorite/` — Toggle favorite
- `POST /documents/<id>/restore/` — Restore from archive
- `POST /documents/<id>/versions/` — Version history
- `GET /documents/duplicates/` — Duplicate detection
- `GET /documents/folders/` — Folder tree

---

## 5. Storage Backend Analysis

### 5.1 Current Configuration
- `MEDIA_URL = "/media/"`
- `MEDIA_ROOT = <BASE_DIR>/media`
- No `DEFAULT_FILE_STORAGE` override → local filesystem
- `AWS_S3_BUCKET_NAME` and `AWS_S3_REGION_NAME` are env vars in `settings.py` but **never wired up** to a storage backend
- `boto3==1.35.28` is in `requirements.txt` but `django-storages` is **missing**

### 5.2 S3 Integration Status
- **Partially configured.** S3 credentials are read but not used for file storage.
- To enable S3: add `django-storages[boto3]`, set `DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'`, and configure `AWS_QUERYSTRING_AUTH`, `AWS_S3_FILE_OVERWRITE`, etc.

### 5.3 Signed URLs
- No existing signed URL generation for document preview/download.
- If S3 is enabled, signed URLs can be generated via `boto3.client('s3').generate_presigned_url`.
- For local storage, Django can serve files via `django.views.static.serve` in DEBUG, but signed URLs are not natively available.

---

## 6. Permissions & Security

| Feature | Current State |
|---------|---------------|
| Authentication | JWT Bearer (`rest_framework_simplejwt`) |
| Authorization | `IsAuthenticated` + manual ownership check (`unit.owner == request.user`) |
| Role-based access | No explicit roles; groups exist on `User` model |
| Feature limits | `FeatureEnforcer` checks `PlanFeatureLimit` + `UsageLimit` |
| File validation | SHA256 deduplication only on `UnitDocument` and `UnitImage` |
| MIME type validation | **Not enforced** at model or serializer level |
| File size limits | **Not enforced** at model level |
| Virus scan | **Not implemented** |
| Encryption at rest | **Not configured** |
| Signed URLs | **Not implemented** for documents |

---

## 7. Feature Limits

Relevant `AddOnPurchase.FEATURE_CHOICES`:

| Feature Key | Description |
|-------------|-------------|
| `max_buildings` | Max buildings |
| `max_units` | Max units |
| `max_renters` | Max renters per unit |
| `max_unit_images` | Max unit images |
| `max_document_uploads` | Max document uploads per unit |
| `export_pdf_dossier` | Export PDF dossier |

The `FeatureEnforcer` already supports `max_document_uploads` but only for `UnitDocument`. A generic document management feature key (e.g., `max_documents`) should be added.

---

## 8. Validation, File Size & MIME Types

| Aspect | Current State |
|--------|---------------|
| Allowed MIME types | **Not explicitly defined** |
| File size restrictions | **Not enforced** |
| Image validation | Pillow implicit validation via `ImageField` |
| PDF validation | No explicit validation |
| Office doc validation | **Not supported** |
| Archive validation | **Not supported** |
| Audio/Video validation | **Not supported** |
| Text file validation | **Not supported** |

---

## 9. Missing Services

| Service | Current State | Notes |
|---------|---------------|-------|
| Virus scan | **Not implemented** | Needs ClamAV or external service |
| OCR | `properties/services/ocr_service.py` | Only for Form 16 / rent receipts (pdfplumber) |
| Compression | **Not implemented** | Needs `zipfile`, `pypdf`, `PIL` compression |
| Thumbnail generation | **Not implemented** | Needs `PIL` or `ffmpeg` for video |
| Background upload | **Not implemented** | Needs Celery or expo-task |
| Background download | **Not implemented** | Needs expo-task or native module |
| Duplicate detection | SHA256 on UnitDocument/UnitImage only | Needs extension to generic documents |
| Version history | **Not implemented** | Needs `simple-history` or custom model |

---

## 10. Serializer Analysis

Existing serializers:
- `UnitDocumentSerializer` — fields: `__all__`
- `UnitImageSerializer` — fields: `__all__`
- `RentAgreementDraftSerializer` — fields: `__all__`

No generic document serializer exists.

---

## 11. Missing Endpoints — Detailed Explanation & Django Implementation Suggestions

### 11.1 Generic Document CRUD

**Why missing:** The backend only has property-specific document models (`UnitDocument`, `UnitImage`). There is no standalone `Document` model.

**Suggested Django implementation:**

```python
# documents/models.py
class Document(models.Model):
    class DocumentType(models.TextChoices):
        IMAGE = "image", "Image"
        PDF = "pdf", "PDF"
        DOC = "doc", "DOC"
        DOCX = "docx", "DOCX"
        EXCEL = "excel", "Excel"
        CSV = "csv", "CSV"
        ZIP = "zip", "ZIP"
        TEXT = "text", "Text"
        AUDIO = "audio", "Audio"
        VIDEO = "video", "Video"

    class Visibility(models.TextChoices):
        PRIVATE = "private", "Private"
        SHARED = "shared", "Shared"
        PUBLIC = "public", "Public"

    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="documents")
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="children")
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/%Y/%m/%d/")
    file_hash = models.CharField(max_length=64, editable=False, db_index=True)
    mime_type = models.CharField(max_length=100)
    size = models.BigIntegerField()
    document_type = models.CharField(max_length=20, choices=DocumentType.choices)
    thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)
    is_favorite = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    is_shared = models.BooleanField(default=False)
    share_token = models.CharField(max_length=64, null=True, blank=True, db_index=True)
    metadata = models.JSONField(default=dict, blank=True)
    version = models.PositiveIntegerField(default=1)
    previous_version = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="next_versions")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["owner", "parent", "created_at"])]

# documents/serializers.py
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ["owner", "file_hash", "created_at", "updated_at"]

# documents/views.py
class DocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentSerializer

    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user, is_archived=False)

    def perform_create(self, serializer):
        # Enforce max_document_uploads via FeatureEnforcer
        # Calculate mime_type, size, file_hash
        # Generate thumbnail if image/pdf
        # Check duplicates via file_hash
        serializer.save(owner=self.request.user)

# documents/urls.py
router.register(r"documents", DocumentViewSet, basename="documents")
```

### 11.2 Upload Endpoint

**Why missing:** No multipart upload endpoint exists outside of property-specific views.

**Suggested implementation:**
```python
# documents/views.py
class DocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Validate file size (e.g., max 50MB)
        # Validate MIME type against allow-list
        # Compute SHA256 hash
        # Check duplicate via file_hash
        # Save file, generate thumbnail
        # Increment UsageLimit for max_document_uploads
        # Return DocumentSerializer.data
```

### 11.3 Signed Download / Preview URLs

**Why missing:** No presigned URL generation for documents.

**Suggested implementation:**
```python
# documents/views.py
class DocumentDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        doc = get_object_or_404(Document, pk=pk, owner=request.user)
        # If S3: return presigned URL
        # If local: return FileResponse with X-Accel-Redirect or streaming
```

### 11.4 Thumbnail Generation

**Why missing:** No thumbnail service exists.

**Suggested implementation:**
```python
# documents/services/thumbnail_service.py
from PIL import Image
import io

def generate_thumbnail(file_path: str, mime_type: str, size=(256, 256)) -> bytes:
    if mime_type.startswith("image/"):
        img = Image.open(file_path)
        img.thumbnail(size)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()
    elif mime_type == "application/pdf":
        # Use pdf2image or pymupdf for first page thumbnail
        pass
    # Video: use ffmpeg thumbnail filter
```

### 11.5 Virus Scan

**Suggested implementation:**
```python
# documents/services/virus_scan_service.py
import subprocess

def scan_file(file_path: str) -> bool:
    result = subprocess.run(["clamscan", file_path], capture_output=True)
    return result.returncode == 0
```

### 11.6 Compression

**Suggested implementation:**
```python
# documents/services/compression_service.py
import zipfile
from pypdf import PdfWriter

def compress_images(files: list[str]) -> str:
    # ZIP images
    pass

def compress_pdfs(files: list[str]) -> str:
    # Merge via pypdf
    pass
```

### 11.7 Version History

**Suggested implementation:**
- Use `django-simple-history` on `Document` model
- Or implement manual versioning with `previous_version` FK

---

## 12. Backend Compatibility Matrix

| Frontend Feature | Backend Support | Action Required |
|------------------|-----------------|-----------------|
| Upload | Partial (`UnitDocument`) | Add generic `/documents/upload/` |
| Download | Partial (PDF views only) | Add `/documents/<id>/download/` |
| Preview | No | Add `/documents/<id>/preview/` with signed URLs |
| Rename | Partial (PATCH on UnitDocument) | Add generic PATCH support |
| Delete | Partial | Add soft-delete / archive |
| Share | No | Add share token + endpoint |
| Move | No | Add parent folder support |
| Copy | No | Add copy action |
| Favorite | No | Add `is_favorite` field |
| Archive | No | Add `is_archived` field |
| Search | No | Add search filter on `name` + `metadata` |
| Filter | Partial | Add filter backends |
| Sort | Partial | Add ordering fields |
| Folder Support | No | Add `parent` self-FK |
| Multiple Upload | No | Add bulk create endpoint |
| Drag & Drop Ready | No | Frontend only |
| Compression | No | Add service |
| Thumbnail | No | Add service |
| Offline Cache | No | Frontend only |
| Retry Upload | Partial (axios retry) | Frontend only |
| Cancel Upload | Partial (axios cancel) | Frontend only |
| Progress Indicator | Partial (axios onProgress) | Frontend only |
| Background Upload | No | Add Celery task |
| Background Download | No | Add Celery task |
| Duplicate Detection | Partial (SHA256 on UnitDocument) | Extend to generic documents |
| Version History | No | Add simple-history or manual versioning |
| Metadata Viewer | Partial | Add `metadata` JSONField |
| Permission-based access | Yes | Reuse existing |
| Feature limits | Partial | Add `max_documents` feature key |
| Signed URLs | Partial (env vars only) | Wire up S3 or add signed local URLs |
| Secure preview | No | Add signed preview endpoint |
| File validation | Partial | Add MIME + size validation |

---

## 13. Recommendations

1. **Immediate:** Add a dedicated `documents` Django app with `Document` model, serializer, viewset, and router.
2. **Short-term:** Wire up AWS S3 storage via `django-storages` for scalable, signed-URL-ready file storage.
3. **Medium-term:** Add thumbnail generation, compression, and virus scanning as Celery background tasks.
4. **Medium-term:** Add `max_documents` feature key to `PlanFeatureLimit` and enforce via `FeatureEnforcer`.
5. **Long-term:** Implement versioning via `django-simple-history` and folder support via self-referential `parent` FK.

---

## 14. Proceed to Frontend Implementation

The frontend module should be built against:
- Existing endpoints: `properties/unit-all-documents/`, `properties/unit-images/`, `document/` (PDF views)
- **Proposed new endpoints:** `/api/documents/` (generic CRUD, to be added to backend)

The frontend must gracefully handle:
- 404 on new endpoints (fallback to property-specific endpoints)
- Missing S3 signed URLs (fallback to direct URLs)
- Missing thumbnails (generate client-side or show placeholder)
