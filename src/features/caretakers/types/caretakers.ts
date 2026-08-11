export interface Caretaker {
  id: number;
  unit: number;
  user: number | null;
  name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  address: string;
  joining_date: string;
  leaving_date: string | null;
  is_active: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CaretakerUnitInfo {
  id: number;
  unit: string;
  building_name: string;
  unit_type: string;
  status: string;
  city: string;
  state: string;
}

export interface CaretakerHistoryEntry {
  id: string;
  action: string;
  changed_by: string | null;
  timestamp: string;
  data: Record<string, any>;
}

export interface CaretakerCreatePayload {
  unit: number;
  name: string;
  phone: string;
  email?: string;
  alternate_phone?: string;
  address?: string;
  joining_date: string;
  notes?: string;
}

export interface CaretakerUpdatePayload extends Partial<CaretakerCreatePayload> {
  is_active?: boolean;
  leaving_date?: string | null;
}

export interface CaretakerListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: Caretaker[];
}

export type CaretakerDetailResponse = Caretaker;

export interface CaretakerFilters {
  search?: string;
  unit?: number;
  is_active?: boolean;
  ordering?: string;
  page?: number;
}

export type CaretakerStatus = 'active' | 'inactive';

export interface CaretakerStats {
  total: number;
  active: number;
  inactive: number;
}

export interface CaretakerTimelineEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: string | null;
}
