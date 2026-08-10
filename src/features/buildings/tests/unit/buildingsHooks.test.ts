import { renderHook } from '@testing-library/react-native';
import { useBuildings } from '../hooks/useBuildings';
import { useBuilding } from '../hooks/useBuilding';

describe('useBuildings', () => {
  it('should return default state when called without userId', () => {
    const { result } = renderHook(() => useBuildings());
    expect(result.current.buildings).toEqual([]);
    expect(typeof result.current.createBuilding).toBe('function');
    expect(typeof result.current.updateBuilding).toBe('function');
    expect(typeof result.current.deleteBuilding).toBe('function');
  });
});

describe('useBuilding', () => {
  it('should return default state when called without id', () => {
    const { result } = renderHook(() => useBuilding(0));
    expect(result.current.building).toBeNull();
    expect(typeof result.current.refresh).toBe('function');
  });
});
