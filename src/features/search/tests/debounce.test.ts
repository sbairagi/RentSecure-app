// @ts-nocheck
import { useDebounce } from '../useDebounce';
import { renderHook } from '@testing-library/react-native';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('debounces value change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    );

    expect(result.current).toBe('hello');

    rerender({ value: 'world', delay: 300 });
    expect(result.current).toBe('hello');

    jest.advanceTimersByTime(300);
    expect(result.current).toBe('world');
  });

  it('cancels pending timeout on new value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    );

    rerender({ value: 'world', delay: 300 });
    jest.advanceTimersByTime(150);
    expect(result.current).toBe('hello');

    rerender({ value: 'again', delay: 300 });
    jest.advanceTimersByTime(150);
    expect(result.current).toBe('hello');

    jest.advanceTimersByTime(300);
    expect(result.current).toBe('again');
  });

  it('handles number values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 1, delay: 100 } }
    );

    rerender({ value: 2, delay: 100 });
    jest.advanceTimersByTime(100);
    expect(result.current).toBe(2);
  });

  it('handles zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 0 } }
    );

    rerender({ value: 'b', delay: 0 });
    expect(result.current).toBe('b');
  });
});
