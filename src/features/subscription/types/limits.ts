export type FeatureKey =
  | 'max_buildings'
  | 'max_units'
  | 'max_renters'
  | 'max_caretakers'
  | 'max_unit_images'
  | 'max_document_uploads'
  | 'tax_notifications'
  | 'whatsapp_alerts'
  | 'rent_agreement_drafting'
  | 'export_pdf_dossier';

export interface FeatureLimitEntry {
  featureKey: FeatureKey;
  label: string;
  planLimit: number | 'unlimited';
  addOnLimit: number;
  effectiveLimit: number | 'unlimited';
  currentUsage: number;
  remaining: number | 'unlimited';
  percentageUsed: number;
  canUse: boolean;
}

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  max_buildings: 'Buildings',
  max_units: 'Units',
  max_renters: 'Renters',
  max_caretakers: 'Caretakers',
  max_unit_images: 'Unit Images',
  max_document_uploads: 'Documents',
  tax_notifications: 'Tax Notifications',
  whatsapp_alerts: 'WhatsApp Alerts',
  rent_agreement_drafting: 'Rent Agreement Drafting',
  export_pdf_dossier: 'PDF Export',
};
