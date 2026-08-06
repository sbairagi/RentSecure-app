import {
  mockAgreement,
  mockAgreementDocument,
  mockAgreementListResponse,
  mockAgreementStatusSummary,
  mockAgreementTimeline,
  mockAgreementWitness,
} from './data';

export const handlers = {
  getAgreements: () => ({
    list: jest.fn().mockResolvedValue(mockAgreementListResponse),
    retrieve: jest.fn().mockResolvedValue(mockAgreement),
    create: jest.fn().mockResolvedValue(mockAgreement),
    update: jest.fn().mockResolvedValue(mockAgreement),
    remove: jest.fn().mockResolvedValue(undefined),
    sendForSignature: jest.fn().mockResolvedValue(mockAgreement),
    generatePDF: jest.fn().mockResolvedValue(new Blob()),
    listDocuments: jest.fn().mockResolvedValue([mockAgreementDocument]),
    uploadDocument: jest.fn().mockResolvedValue(mockAgreementDocument),
    listTimeline: jest.fn().mockResolvedValue([mockAgreementTimeline]),
    listWitnesses: jest.fn().mockResolvedValue([mockAgreementWitness]),
    addWitness: jest.fn().mockResolvedValue(mockAgreementWitness),
    listTemplates: jest.fn().mockResolvedValue([]),
    getStatusSummary: jest.fn().mockResolvedValue(mockAgreementStatusSummary),
  }),
};
