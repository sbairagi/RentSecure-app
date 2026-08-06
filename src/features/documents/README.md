# Enterprise Document Management System

## Overview

The `documents` feature module provides a complete enterprise document management system for RentSecure. It supports uploading, downloading, previewing, sharing, organizing, and managing documents with full offline support, background uploads, and subscription-based feature limits.

## Architecture

```
src/features/documents/
├── types/           # TypeScript interfaces and types
├── constants/       # API endpoints, MIME types, limits, configs
├── services/        # API service layer (documentsApi)
├── repository/      # Data repository (documentsRepository)
├── store/           # Zustand state management
├── hooks/           # React Query + custom hooks
├── screens/         # Expo Router screens
├── components/      # Reusable UI components
├── utils/           # Helper functions
├── validations/     # Zod schemas
└── tests/           # Unit tests
```

## Backend Compatibility

See `docs/BACKEND_ANALYSIS_REPORT.md` for the full backend compatibility report.

### Existing Supported Endpoints

- `GET /properties/unit-all-documents/` — Unit documents
- `GET /properties/unit-images/` — Unit images
- `GET /document/rent_agreement/<id>/generate-rent-agreement-pdf/` — PDF generation
- `GET /document/properties/<id>/generate-dossier-pdf/` — Dossier PDF
- `GET /document/rent_receipt/<id>/pdf_receipt/` — Receipt PDF

### Required New Backend Endpoints

The following endpoints must be added to `RentSecureBE`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/documents/` | List documents with search/filter/sort |
| POST | `/api/documents/` | Create document metadata |
| GET | `/api/documents/<id>/` | Retrieve document |
| PATCH | `/api/documents/<id>/` | Update document |
| DELETE | `/api/documents/<id>/` | Delete document |
| POST | `/api/documents/upload/` | Upload file with multipart |
| GET | `/api/documents/<id>/download/` | Download document |
| GET | `/api/documents/<id>/preview/` | Preview document |
| POST | `/api/documents/<id>/move/` | Move to folder |
| POST | `/api/documents/<id>/copy/` | Copy document |
| POST | `/api/documents/<id>/share/` | Share document |
| POST | `/api/documents/<id>/favorite/` | Toggle favorite |
| POST | `/api/documents/<id>/archive/` | Archive document |
| POST | `/api/documents/<id>/restore/` | Restore document |
| GET | `/api/documents/<id>/versions/` | Version history |
| GET | `/api/documents/duplicates/` | Duplicate detection |
| GET | `/api/documents/folders/` | Folder tree |
| GET | `/api/documents/usage-limits/` | Feature limits |

## Features

- Upload with progress indicator
- Download with retry logic
- Secure preview via signed URLs
- Rename, move, copy, delete
- Share with tokens
- Favorite and archive
- Search, filter, sort
- Folder support
- Multiple file upload
- Drag & drop ready (frontend)
- Compression service (backend)
- Thumbnail generation (backend)
- Offline cache (MMKV)
- Retry and cancel upload
- Background upload/download (backend Celery)
- Duplicate detection (SHA256)
- Version history
- Metadata viewer
- Permission-based access
- Feature limits via PlanFeatureLimit

## Usage

```tsx
import { useDocuments } from '@/features/documents/hooks';
import { useUploadDocument } from '@/features/documents/hooks';
import { useDocumentMutations } from '@/features/documents/hooks';

// List documents
const { documents, isLoading, refresh } = useDocuments({ type: 'pdf' });

// Upload
const { upload, isUploading } = useUploadDocument();
await upload({ name: 'myfile.pdf', file: formData });

// Mutations
const { remove, toggleFavorite, archive } = useDocumentMutations();
await remove(1);
await toggleFavorite(1);
await archive(1);
```

## Tests

```bash
npm test
```

## Quality Check

- TypeScript strict mode
- ESLint + Prettier
- React Query best practices
- Zustand state management
- Offline-first with MMKV cache
