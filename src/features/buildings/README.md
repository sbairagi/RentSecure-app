# Building Management Module

## Overview

Complete Building Management module for RentSecure frontend.

## Folder Structure

```
features/buildings/
  screens/
    BuildingListScreen.tsx
    BuildingDetailsScreen.tsx
    AddBuildingScreen.tsx
    EditBuildingScreen.tsx
    DeleteConfirmationScreen.tsx
    BuildingGalleryScreen.tsx
    BuildingDocumentsScreen.tsx
    BuildingAnalyticsScreen.tsx
    BuildingMapScreen.tsx
  components/
    BuildingCard.tsx
    BuildingSearchBar.tsx
    BuildingFilterSheet.tsx
    BuildingSortSheet.tsx
    BuildingSkeleton.tsx
    BuildingEmptyState.tsx
    BuildingErrorState.tsx
    BuildingStatsRow.tsx
    BuildingLimitBanner.tsx
  hooks/
    useBuildings.ts
    useBuilding.ts
    useBuildingAnalytics.ts
  services/
    buildingsApi.ts
  repository/
    buildingsRepository.ts
  store/
    buildingsStore.ts
  types/
    buildings.ts
  validations/
    buildingSchemas.ts
  constants/
    buildingConstants.ts
  utils/
    buildingHelpers.ts
  tests/
    buildings.test.tsx
```

## Backend Compatibility Notes

- Endpoints: `/api/buildings/` (CRUD via `BuildingViewSet`).
- Backend does not support search, filter, sort, or pagination. Frontend implements client-side fallback.
- Backend does not expose building coordinates or media (images/documents). Map, Gallery, and Documents screens show placeholders.
- Backend `UsageLimit` does not expose plan limits. `FeatureLimitGuard` is not used; limit checks rely on backend `PermissionDenied` responses and `BuildingLimitBanner`.

## Routes

- `/(drawer)/(tabs)/buildings` → list
- `/(drawer)/(tabs)/buildings/[id]` → details
- `/(drawer)/(tabs)/buildings/add` → add
- `/(drawer)/(tabs)/buildings/[id]/edit` → edit
- `/(drawer)/(tabs)/buildings/[id]/delete` → delete confirmation
- `/(drawer)/(tabs)/buildings/[id]/gallery` → gallery (placeholder)
- `/(drawer)/(tabs)/buildings/[id]/documents` → documents (placeholder)
- `/(drawer)/(tabs)/buildings/[id]/analytics` → analytics
- `/(drawer)/(tabs)/buildings/[id]/map` → map (placeholder)

## Testing

Run tests with:

```bash
npx jest src/features/buildings/tests/buildings.test.tsx
```
