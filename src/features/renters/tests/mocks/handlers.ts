import {
  mockRenter,
  mockRenterActivity,
  mockRenterAgreement,
  mockRenterDocument,
  mockRenterKYC,
  mockRenterListResponse,
  mockRenterPayment,
  mockRenterProfile,
  mockRenterStatusSummary,
  mockRenterTimeline,
} from './data';

export const handlers = {
  getRenters: () => ({
    list: jest.fn().mockResolvedValue(mockRenterListResponse),
    retrieve: jest.fn().mockResolvedValue(mockRenter),
    create: jest.fn().mockResolvedValue(mockRenter),
    update: jest.fn().mockResolvedValue(mockRenter),
    remove: jest.fn().mockResolvedValue(undefined),
    getKYC: jest.fn().mockResolvedValue(mockRenterKYC),
    listDocuments: jest.fn().mockResolvedValue([mockRenterDocument]),
    uploadDocument: jest.fn().mockResolvedValue(mockRenterDocument),
    listPayments: jest.fn().mockResolvedValue([mockRenterPayment]),
    listAgreements: jest.fn().mockResolvedValue([mockRenterAgreement]),
    listTimeline: jest.fn().mockResolvedValue([mockRenterTimeline]),
    listActivity: jest.fn().mockResolvedValue([mockRenterActivity]),
    getProfile: jest.fn().mockResolvedValue(mockRenterProfile),
    getStatusSummary: jest.fn().mockResolvedValue(mockRenterStatusSummary),
  }),
};
