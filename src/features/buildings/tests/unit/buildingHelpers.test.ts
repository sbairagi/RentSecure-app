import { computeBuildingStats, formatBuildingAddress, getBuildingStatus } from '../buildingHelpers';
import type { Building } from '../types/buildings';

describe('buildingHelpers', () => {
  const buildingWithCounts: Building = {
    id: 1,
    name: 'Sunshine Complex',
    address_line: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postal_code: '400001',
    owner: 1,
    is_archived: false,
    created_at: '2024-01-01T00:00:00Z',
    units_count: 12,
    occupied_units_count: 8,
  };

  const buildingWithoutCounts: Building = {
    id: 2,
    name: 'Tower A',
    address_line: '456 Oak Ave',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    postal_code: '110001',
    owner: 1,
    is_archived: true,
    created_at: '2024-02-01T00:00:00Z',
    units: [
      { id: 1, unit: '101', unit_type: 'flat', status: 'occupied', is_vacant: false, city: 'Delhi', state: 'Delhi', country: 'India' },
      { id: 2, unit: '102', unit_type: 'flat', status: 'vacant', is_vacant: true, city: 'Delhi', state: 'Delhi', country: 'India' },
    ],
  };

  it('should compute stats from backend counts when available', () => {
    const stats = computeBuildingStats(buildingWithCounts);
    expect(stats.totalUnits).toBe(12);
    expect(stats.occupiedUnits).toBe(8);
    expect(stats.vacantUnits).toBe(4);
  });

  it('should compute stats from units array when counts are missing', () => {
    const stats = computeBuildingStats(buildingWithoutCounts);
    expect(stats.totalUnits).toBe(2);
    expect(stats.occupiedUnits).toBe(1);
    expect(stats.vacantUnits).toBe(1);
  });

  it('should return active for non-archived building', () => {
    expect(getBuildingStatus(buildingWithCounts)).toBe('active');
  });

  it('should return archived for archived building', () => {
    expect(getBuildingStatus(buildingWithoutCounts)).toBe('archived');
  });

  it('should format address correctly', () => {
    expect(formatBuildingAddress(buildingWithCounts)).toBe(
      '123 Main St, Mumbai, Maharashtra, India'
    );
  });
});
