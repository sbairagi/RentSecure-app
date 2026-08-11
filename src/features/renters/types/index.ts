import {
  BootstrapData,
  Building,
  ExtraCharge,
  FeatureAccess,
  KycDocument,
  KycDocumentType,
  Notification,
  PaymentMethod,
  PaymentStatus,
  PoliceVerification,
  RentAgreement,
  Renter,
  RenterActivity,
  RenterAgreement,
  RenterAssignUnitPayload,
  RenterBuildingSummary,
  RenterBulkNotifyPayload,
  RenterCreatePayload,
  RenterDocument,
  RenterFilters,
  RenterListResponse,
  RenterNote,
  RenterPayment,
  RenterProfile,
  RenterStatus,
  RenterStatusConfig,
  RenterStatusSummary,
  RenterSummary,
  RenterTimelineEntry,
  RenterTransferUnitPayload,
  RenterUnitSummary,
  RenterUpdatePayload,
  RenterWithRelations,
  RentRecord,
  SortOption,
  SubscriptionLimits,
  Unit,
} from './renters';

export {
  BootstrapData,
  Building,
  ExtraCharge,
  FeatureAccess,
  KycDocument,
  KycDocumentType,
  Notification,
  PaymentMethod,
  PaymentStatus,
  PoliceVerification,
  RentAgreement,
  Renter,
  RenterActivity,
  RenterAgreement,
  RenterAssignUnitPayload,
  RenterBuildingSummary,
  RenterBulkNotifyPayload,
  RenterCreatePayload,
  RenterDocument,
  RenterFilters,
  RenterListResponse,
  RenterNote,
  RenterPayment,
  RenterProfile,
  RenterStatus,
  RenterStatusConfig,
  RenterStatusSummary,
  RenterSummary,
  RenterTimelineEntry,
  RenterTransferUnitPayload,
  RenterUnitSummary,
  RenterUpdatePayload,
  RenterWithRelations,
  RentRecord,
  SortOption,
  SubscriptionLimits,
  Unit,
};

export interface SelectedFilters {
  status?: string;
  property?: string;
  building?: string;
  police_verification?: string;
}

export interface RenterCardProps {
  renter: Renter;
  onPress: () => void;
  testID?: string;
}

export interface RenterSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export interface RenterFilterChipsProps {
  selectedFilters: SelectedFilters;
  onFilterChange: (filters: SelectedFilters) => void;
}

export interface RenterStatusBadgeProps {
  status: RenterStatus;
}

export interface RenterProfileHeaderProps {
  renter: Renter;
  onEdit: () => void;
  onDelete: () => void;
  onVacate: () => void;
  onAssignUnit: () => void;
  onTransferUnit: () => void;
}

export interface RenterInfoSectionProps {
  title: string;
  data: { label: string; value: string }[];
}

export interface KYCDocumentCardProps {
  document: KycDocument;
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export interface KYCUploadDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { document_type: string; document_number: string; file: string }) => void;
}

export interface PoliceVerificationCardProps {
  verification: PoliceVerification;
  onUpload: () => void;
  onDownload: () => void;
}

export interface AgreementCardProps {
  agreement: RenterAgreement;
}

export interface RentRecordCardProps {
  record: RentRecord;
}

export interface ExtraChargeCardProps {
  charge: ExtraCharge;
}

export interface TimelineItemProps {
  item: {
    id: number;
    title: string;
    description: string;
    timestamp: string;
    icon?: string;
  };
}

export interface NoteCardProps {
  note: RenterNote;
}

export interface FeatureLimitBannerProps {
  currentUsage: number;
  limit: number | 'unlimited';
  featureName: string;
  onUpgrade: () => void;
}

export interface BulkActionsBarProps {
  selectedCount: number;
  onExport: () => void;
  onNotify: () => void;
  onDelete: () => void;
  onMove: () => void;
  onClearSelection: () => void;
}

export type SkeletonLoaderType = 'list' | 'detail';

export interface RenterSkeletonLoaderProps {
  type?: SkeletonLoaderType;
}
