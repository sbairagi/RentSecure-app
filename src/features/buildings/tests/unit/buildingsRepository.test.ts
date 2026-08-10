import { buildingsRepository } from '../repository/buildingsRepository';

describe('buildingsRepository', () => {
  it('should have fetchBuildings method', () => {
    expect(typeof buildingsRepository.fetchBuildings).toBe('function');
  });

  it('should have fetchBuilding method', () => {
    expect(typeof buildingsRepository.fetchBuilding).toBe('function');
  });

  it('should have createBuilding method', () => {
    expect(typeof buildingsRepository.createBuilding).toBe('function');
  });

  it('should have updateBuilding method', () => {
    expect(typeof buildingsRepository.updateBuilding).toBe('function');
  });

  it('should have deleteBuilding method', () => {
    expect(typeof buildingsRepository.deleteBuilding).toBe('function');
  });

  it('should have fetchAnalytics method', () => {
    expect(typeof buildingsRepository.fetchAnalytics).toBe('function');
  });
});
