import { FeatureKey, FEATURE_LABELS } from '../types/limits';

export const BOOLEAN_FEATURES: FeatureKey[] = [
  'tax_notifications',
  'whatsapp_alerts',
  'rent_agreement_drafting',
  'export_pdf_dossier',
];

export const NUMERIC_FEATURES: FeatureKey[] = [
  'max_buildings',
  'max_units',
  'max_renters',
  'max_caretakers',
  'max_unit_images',
  'max_document_uploads',
];

export const FEATURE_DESCRIPTIONS: Partial<Record<FeatureKey, string>> = {
  max_buildings: 'Number of buildings you can manage',
  max_units: 'Total units across all buildings',
  max_renters: 'Renters per unit',
  max_caretakers: 'Caretakers per unit',
  max_unit_images: 'Images per unit',
  max_document_uploads: 'Documents per unit',
  tax_notifications: 'Receive tax reminder notifications',
  whatsapp_alerts: 'WhatsApp message alerts',
  rent_agreement_drafting: 'Generate rent agreement drafts',
  export_pdf_dossier: 'Export property dossier as PDF',
};

export function isBooleanFeature(key: string): boolean {
  return BOOLEAN_FEATURES.includes(key as FeatureKey);
}

export function isNumericFeature(key: string): boolean {
  return NUMERIC_FEATURES.includes(key as FeatureKey);
}
