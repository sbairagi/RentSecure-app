export interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  building: number;
  building_name?: string;
  unit: number;
  unit_name?: string;
  renter: number | null;
  renter_name?: string;
  owner: number;
  assigned_caretaker: number | null;
  assigned_caretaker_name?: string;
  assigned_vendor: number | null;
  assigned_vendor_name?: string;
  preferred_date: string | null;
  notes: string;
  resolution_notes: string;
  is_approved: boolean;
  approved_by: number | null;
  approved_by_name?: string;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
}

export interface MaintenanceComment {
  id: number;
  request: number;
  author: number;
  author_name: string;
  text: string;
  mentions: number[];
  created_at: string;
}

export interface MaintenanceExpense {
  id: number;
  request: number;
  description: string;
  estimated_cost: string | null;
  actual_cost: string | null;
  vendor_cost: string | null;
  material_cost: string | null;
  labour_cost: string | null;
  additional_charges: string;
  payment_status: MaintenancePaymentStatus;
  receipt: string | null;
  total_cost: string;
  created_at: string;
}

export interface MaintenanceDocument {
  id: number;
  request: number;
  document_type: MaintenanceDocumentType;
  file: string;
  file_name: string;
  uploaded_by: number;
  uploaded_by_name: string;
  uploaded_at: string;
}

export interface MaintenanceImage {
  id: number;
  request: number;
  image_type: MaintenanceDocumentType;
  image: string;
  uploaded_by: number;
  uploaded_at: string;
}

export interface MaintenanceActivity {
  id: number;
  request: number;
  activity_type: MaintenanceActivityType;
  description: string;
  user: number | null;
  user_name: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  address: string;
  is_active: boolean;
  owner: number;
  created_at: string;
}

export interface MaintenanceCreatePayload {
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  building: number;
  unit: number;
  renter?: number | null;
  preferred_date?: string | null;
  notes?: string;
  images?: File[];
  documents?: File[];
}

export interface MaintenanceUpdatePayload extends Partial<MaintenanceCreatePayload> {
  status?: MaintenanceStatus;
  assigned_caretaker?: number | null;
  assigned_vendor?: number | null;
  resolution_notes?: string;
  is_approved?: boolean;
}

export interface MaintenanceCommentPayload {
  text: string;
  mentions?: number[];
}

export interface MaintenanceExpensePayload {
  description: string;
  estimated_cost?: string | null;
  actual_cost?: string | null;
  vendor_cost?: string | null;
  material_cost?: string | null;
  labour_cost?: string | null;
  additional_charges?: string;
  payment_status?: MaintenancePaymentStatus;
  receipt?: File | null;
}

export interface MaintenanceListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: MaintenanceRequest[];
}

export type MaintenanceDetailResponse = MaintenanceRequest;

export interface MaintenanceFilters {
  search?: string;
  status?: MaintenanceStatus | '';
  priority?: MaintenancePriority | '';
  category?: MaintenanceCategory | '';
  building?: number | '';
  unit?: number | '';
  renter?: number | '';
  caretaker?: number | '';
  vendor?: number | '';
  date_from?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
}

export type MaintenanceStatus =
  | 'created'
  | 'submitted'
  | 'acknowledged'
  | 'assigned'
  | 'in_progress'
  | 'waiting_for_parts'
  | 'waiting_for_approval'
  | 'resolved'
  | 'closed'
  | 'rejected'
  | 'cancelled';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export type MaintenanceCategory =
  | 'plumbing'
  | 'electrical'
  | 'ac'
  | 'appliance'
  | 'carpentry'
  | 'cleaning'
  | 'security'
  | 'water'
  | 'internet'
  | 'other';

export type MaintenancePaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded';

export type MaintenanceDocumentType =
  | 'before_photo'
  | 'after_photo'
  | 'invoice'
  | 'receipt'
  | 'service_report'
  | 'other';

export type MaintenanceActivityType =
  | 'created'
  | 'updated'
  | 'assigned'
  | 'status_changed'
  | 'comment_added'
  | 'photo_uploaded'
  | 'document_uploaded'
  | 'expense_added'
  | 'approved'
  | 'rejected'
  | 'resolved'
  | 'closed';

export interface MaintenanceStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  urgent: number;
  total_expenses: string;
  pending_approval: number;
}

export interface MaintenanceTimelineEntry {
  id: number;
  activity_type: MaintenanceActivityType;
  description: string;
  user_name: string | null;
  created_at: string;
  metadata: Record<string, any>;
}
