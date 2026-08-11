export const mockCaretaker = {
  id: 1,
  unit: 1,
  user: null,
  name: 'Rahul Caretaker',
  email: 'rahul@example.com',
  phone: '+919876543210',
  alternate_phone: '',
  address: '123 Main St',
  joining_date: '2024-01-01',
  leaving_date: null,
  is_active: true,
  notes: '',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockCaretakerList = [mockCaretaker];

export const mockCaretakerListResponse = {
  count: 1,
  next: null,
  previous: null,
  results: mockCaretakerList,
};

export const mockCaretakerHistoryEntry = {
  id: '1',
  action: '+',
  changed_by: 'owner@example.com',
  timestamp: '2024-01-01T00:00:00Z',
  data: {
    name: 'Rahul Caretaker',
    phone: '+919876543210',
    email: 'rahul@example.com',
    is_active: true,
    unit: 1,
    joining_date: '2024-01-01',
    leaving_date: null,
  },
};

export const mockCaretakerUnit = {
  id: 1,
  unit: 'A-101',
  building_name: 'Sunshine Complex',
  unit_type: 'flat',
  status: 'occupied',
  city: 'Mumbai',
  state: 'Maharashtra',
};
