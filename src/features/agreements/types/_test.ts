import type { Agreement, AgreementCreatePayload, AgreementDocument, AgreementFilters, AgreementListResponse, AgreementStatusSummary, AgreementTimelineEntry, AgreementUpdatePayload, AgreementWithRelations, AgreementWitness, BootstrapData, FeatureAccess, SubscriptionLimits } from './agreements';

const agreement: Agreement = {
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

const filters: AgreementFilters = {
  search: 'test',
  status: 'active',
  building: 1,
  unit: 1,
  renter: 1,
  date_from: '2024-01-01',
  date_to: '2024-12-31',
  is_signed: true,
  ordering: 'newest',
  page: 1,
};

const payload: AgreementCreatePayload = {
  renter: 1,
  unit: 1,
  agreement_start_date: '2024-01-01',
  agreement_end_date: '2025-01-01',
  rent_amount: '15000',
  security_deposit: '30000',
  notes: 'Test',
  witness_name: 'Amit Kumar',
  witness_phone: '+919876543210',
  witness_address: '123 Main St',
};

const listResponse: AgreementListResponse = {
  count: 1,
  next: null,
  previous: null,
  results: [agreement],
};

const summary: AgreementStatusSummary = {
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

const bootstrap: BootstrapData = {
  user: {},
  subscription: {},
  addOns: [],
  featureLimits: [],
  feature_access: {
    can_create: true,
    can_edit: true,
    can_delete: true,
    can_sign: true,
    can_generate_pdf: true,
    can_upload_documents: true,
    can_bulk_operations: false,
    can_export: false,
    can_analytics: false,
    can_renew: true,
    can_terminate: true,
  },
};

const limits: SubscriptionLimits = {
  max_agreements: 10,
  max_document_uploads: 50,
  current_agreements: 1,
  current_documents: 0,
  can_create_agreement: true,
  can_edit_agreement: true,
  can_delete_agreement: true,
  can_sign_agreement: true,
  can_generate_pdf: true,
  can_upload_documents: true,
  can_bulk_operations: false,
  can_export: false,
  can_analytics: false,
};

const doc: AgreementDocument = {
  id: 1,
  agreement: 1,
  document: 'doc.pdf',
  document_type: 'rent_agreement',
  file_name: 'rent_agreement.pdf',
  file_size: 102400,
  mime_type: 'application/pdf',
  uploaded_at: '2024-01-01T00:00:00Z',
  uploaded_by: 'Owner',
};

const timeline: AgreementTimelineEntry = {
  id: 1,
  agreement: 1,
  action: 'created',
  description: 'Agreement draft created',
  timestamp: '2024-01-01T00:00:00Z',
  user: 'System',
  user_role: 'owner',
  metadata: {},
};

const witness: AgreementWitness = {
  id: 1,
  agreement: 1,
  name: 'Amit Kumar',
  phone: '+919876543210',
  address: '123 Main St',
  id_proof: null,
  signed_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const withRelations: AgreementWithRelations = {
  ...agreement,
  documents: [doc],
  timeline: [timeline],
  witnesses: [witness],
};

const updatePayload: AgreementUpdatePayload = {
  notes: 'updated',
  owner_signed: true,
  renter_signed: false,
};

export { agreement, bootstrap, doc, filters, limits, listResponse, payload, summary, timeline, updatePayload, withRelations, witness };
