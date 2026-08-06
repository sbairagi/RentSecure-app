export const mockAgreement = {
  id: 1,
  user: 1,
  renter: 1,
  unit: 1,
  agreement_start_date: '2024-01-01',
  agreement_end_date: '2025-01-01',
  rent_amount: '15000',
  security_deposit: '30000',
  file: null,
  leegality_document_id: null,
  owner_signed: false,
  renter_signed: false,
  generated_at: null,
  notes: '',
  is_agreement_revoked: false,
  revocation_reason: '',
  revoked_by_owner: false,
  revoked_on: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  renter_name: 'Rahul Sharma',
  renter_phone: '+919876543210',
  unit_name: 'A-101',
  building_name: 'Sunshine Complex',
  status: 'draft',
};

export const mockAgreementList = [mockAgreement];

export const mockAgreementListResponse = {
  count: 1,
  next: null,
  previous: null,
  results: mockAgreementList,
};

export const mockAgreementDocument = {
  id: 1,
  agreement: 1,
  document: 'agreement.pdf',
  document_type: 'rent_agreement',
  file_name: 'rent_agreement.pdf',
  file_size: 102400,
  mime_type: 'application/pdf',
  uploaded_at: '2024-01-01T00:00:00Z',
  uploaded_by: 'Owner',
};

export const mockAgreementTimeline = {
  id: 1,
  agreement: 1,
  action: 'created',
  description: 'Agreement draft created',
  timestamp: '2024-01-01T00:00:00Z',
  user: 'System',
  user_role: 'owner',
  metadata: {},
};

export const mockAgreementWitness = {
  id: 1,
  agreement: 1,
  name: 'Amit Kumar',
  phone: '+919876543212',
  address: '123 Main St, Mumbai',
  id_proof: null,
  signed_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockAgreementStatusSummary = {
  draft: 1,
  pending_signature: 0,
  partially_signed: 0,
  fully_signed: 0,
  active: 0,
  expired: 0,
  terminated: 0,
  cancelled: 0,
  total: 1,
};
