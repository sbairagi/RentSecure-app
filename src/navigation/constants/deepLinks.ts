export const DEEP_LINK_SCHEME = 'rentsecure';
export const DEEP_LINK_HOST = 'app.rentsecure.com';
export const DEEP_LINK_PREFIXES = [
  `${DEEP_LINK_SCHEME}://`,
  `https://${DEEP_LINK_HOST}`,
] as const;

export const DEEP_LINK_PATTERNS = {
  BUILDING: 'building/:id',
  UNIT: 'unit/:id',
  RENTER: 'renter/:id',
  CARETAKER: 'caretaker/:id',
  RENT_RECORD: 'rent/:id',
  MAINTENANCE: 'maintenance/:id',
  VISITOR: 'visitor/:id',
  AGREEMENT: 'agreement/:id',
  DOCUMENT: 'document/:id',
  SUBSCRIPTION: 'subscription',
  NOTIFICATION: 'notification/:id',
  PAYMENT: 'payment/:token',
  INVITATION: 'invitation/:token',
  ONBOARDING: 'onboard-renter/:token',
} as const;

export const DEEP_LINK_ROUTE_MAP: Record<string, string> = {
  [DEEP_LINK_PATTERNS.BUILDING]: '/(drawer)/(tabs)/buildings/[id]',
  [DEEP_LINK_PATTERNS.UNIT]: '/(drawer)/(tabs)/units/[id]',
  [DEEP_LINK_PATTERNS.RENTER]: '/(drawer)/(tabs)/renters/[id]',
  [DEEP_LINK_PATTERNS.CARETAKER]: '/(drawer)/(tabs)/caretakers/[id]',
  [DEEP_LINK_PATTERNS.RENT_RECORD]: '/(drawer)/(tabs)/payments/rent-record/[id]',
  [DEEP_LINK_PATTERNS.MAINTENANCE]: '/(drawer)/(tabs)/maintenance/[id]',
  [DEEP_LINK_PATTERNS.VISITOR]: '/(drawer)/(tabs)/visitors/[id]',
  [DEEP_LINK_PATTERNS.AGREEMENT]: '/(drawer)/(tabs)/agreements/[id]',
  [DEEP_LINK_PATTERNS.SUBSCRIPTION]: '/(drawer)/(tabs)/subscription',
  [DEEP_LINK_PATTERNS.NOTIFICATION]: '/(drawer)/(tabs)/notifications/list',
  [DEEP_LINK_PATTERNS.PAYMENT]: '/payment/[token]',
  [DEEP_LINK_PATTERNS.INVITATION]: '/invitation/[token]',
  [DEEP_LINK_PATTERNS.ONBOARDING]: '/onboard-renter/[token]',
};

export const DEEP_LINK_RESOURCE_ROLES: Record<string, string[]> = {
  building: ['property_owner', 'caretaker', 'admin', 'super_admin'],
  unit: ['property_owner', 'caretaker', 'admin', 'super_admin'],
  renter: ['property_owner', 'caretaker', 'admin', 'super_admin'],
  caretaker: ['property_owner', 'admin', 'super_admin'],
  'rent-record': ['property_owner', 'renter', 'admin', 'super_admin'],
  maintenance: ['property_owner', 'caretaker', 'renter', 'admin', 'super_admin'],
  visitor: ['property_owner', 'caretaker', 'renter', 'admin', 'super_admin'],
  agreement: ['property_owner', 'renter', 'caretaker', 'admin', 'super_admin'],
  document: ['property_owner', 'caretaker', 'renter', 'admin', 'super_admin'],
  subscription: ['property_owner', 'ca_partner', 'admin', 'super_admin'],
  notification: ['property_owner', 'renter', 'caretaker', 'ca_partner', 'admin', 'super_admin', 'support_executive'],
};
