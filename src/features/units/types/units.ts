export interface Unit {
  id: number;
  owner: number;
  building: number | null;
  unit: string;
  building_name: string;
  unit_type: UnitType;
  address_line: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: string | null;
  longitude: string | null;
  status: VacancyStatus;
  is_vacant: boolean;
  is_verified: boolean;
  is_archived: boolean;
  last_vacated_at: string | null;
  rent_due_reminder: boolean;
  agreement_expiry_reminder: boolean;
  maintenance_notes: string;
  notes: string;
  created_at: string;
  updated_at: string;
  current_renter?: RenterSummary | null;
}

export interface UnitImage {
  id: number;
  unit: number;
  renter: number | null;
  image: string;
  image_hash: string;
  uploaded_at: string;
}

export interface UnitDocument {
  id: number;
  unit: number;
  renter: number | null;
  document: string;
  file_hash: string;
  uploaded_at: string;
}

export interface RenterSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: RenterStatus;
  rent_amount: string;
  start_date: string;
  end_date: string | null;
}

export interface CaretakerSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  joining_date: string;
}

export interface UnitWithRelations extends Unit {
  images?: UnitImage[];
  documents?: UnitDocument[];
  current_renter?: RenterSummary | null;
  caretakers?: CaretakerSummary[];
  renters_count?: number;
}

export type UnitType =
  'land' | 'flat' | 'commercial_shop' | 'house' | 'villa' | 'office' | 'paying_guest';

export type VacancyStatus = 'vacant' | 'occupied';

export type RenterStatus = 'active' | 'notice_period' | 'revoked' | 'deactivated';

export type UnitStatusConfig = {
  label: string;
  color: string;
  backgroundColor: string;
};

export type UnitListResponse =
  | Unit[]
  | {
      count: number;
      next: string | null;
      previous: string | null;
      results: Unit[];
    };

export interface UnitAnalytics {
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  occupancy_rate: number;
  monthly_revenue: number;
  pending_maintenance: number;
}

export interface UnitOccupancyStats {
  total: number;
  occupied: number;
  vacant: number;
}

export interface UnitCreatePayload {
  building: number | null;
  unit: string;
  unit_type: UnitType;
  address_line: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude?: string | null;
  longitude?: string | null;
  maintenance_notes?: string;
  notes?: string;
  rent_due_reminder?: boolean;
  agreement_expiry_reminder?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UnitUpdatePayload extends Partial<UnitCreatePayload> {}

export interface UnitFilters {
  search?: string;
  building?: number | null;
  city?: string;
  status?: VacancyStatus | '';
  unit_type?: UnitType | '';
  rent_min?: number;
  rent_max?: number;
  is_archived?: boolean;
  ordering?: string;
  page?: number;
}

export type SortOption = 'newest' | 'oldest' | 'rent_amount' | 'occupancy' | 'alphabetical';

export interface BulkOperationPayload {
  unit_ids: number[];
  action:
    'archive' | 'unarchive' | 'delete' | 'update_status' | 'update_building' | 'export' | 'import';
  data?: Record<string, any>;
}

export interface SubscriptionLimits {
  max_units: number | 'unlimited';
  max_unit_images: number | 'unlimited';
  max_document_uploads: number | 'unlimited';
  current_units: number;
  current_unit_images: number;
  current_documents: number;
  can_create_unit: boolean;
  can_edit_unit?: boolean;
  can_delete_unit?: boolean;
  can_upload_images?: boolean;
  can_upload_documents?: boolean;
  can_bulk_operations?: boolean;
  can_export?: boolean;
  can_import?: boolean;
  can_analytics?: boolean;
  can_qr_code?: boolean;
}

export interface FeatureAccess {
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_upload_images: boolean;
  can_upload_documents: boolean;
  can_bulk_operations: boolean;
  can_export: boolean;
  can_import: boolean;
  can_analytics: boolean;
  can_qr_code: boolean;
}

export interface UnitTimelineEntry {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  user: string;
}
