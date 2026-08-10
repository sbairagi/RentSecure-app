export interface Building {
  id: number;
  name: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  owner: number;
  is_archived: boolean;
  created_at: string;
  units?: BuildingUnit[];
}

export interface BuildingUnit {
  id: number;
  unit: string;
  unit_type: string;
  status: string;
  is_vacant: boolean;
  city: string;
  state: string;
  country: string;
}

export interface BuildingStats {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
}

export interface BuildingAnalytics {
  building_id: number;
  building_name: string;
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  occupancy_rate: number;
}

export interface BuildingCreatePayload {
  name: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface BuildingUpdatePayload extends Partial<BuildingCreatePayload> {}
