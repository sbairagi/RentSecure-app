import { useNavigationContainerRef, usePathname, useSegments } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';

export type NavigationEvent =
  | { type: 'screen_open'; screenName: string; timestamp: number }
  | { type: 'route_change'; from: string; to: string; timestamp: number }
  | { type: 'navigation_time'; from: string; to: string; duration: number };

type AnalyticsCallback = (event: NavigationEvent) => void;

const listeners = new Set<AnalyticsCallback>();

export const subscribeNavigationAnalytics = (callback: AnalyticsCallback): (() => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const emit = (event: NavigationEvent) => {
  listeners.forEach((cb) => {
    try {
      cb(event);
    } catch {
      // ignore listener errors
    }
  });
};

export function useNavigationAnalytics(screenName?: string) {
  const pathname = usePathname();
  const segments = useSegments();
  const navigationRef = useNavigationContainerRef();
  const previousPathRef = useRef(pathname);
  const screenOpenTrackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentScreen = screenName || pathname;
    if (currentScreen && !screenOpenTrackedRef.current.has(currentScreen)) {
      screenOpenTrackedRef.current.add(currentScreen);
      emit({
        type: 'screen_open',
        screenName: currentScreen,
        timestamp: Date.now(),
      });
    }
  }, [pathname, screenName]);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    if (previousPath !== pathname) {
      const startTime = performance.now();
      emit({
        type: 'route_change',
        from: previousPath,
        to: pathname,
        timestamp: Date.now(),
      });

      const duration = performance.now() - startTime;
      emit({
        type: 'navigation_time',
        from: previousPath,
        to: pathname,
        duration,
      });

      previousPathRef.current = pathname;
    }
  }, [pathname]);

  const trackScreenView = useCallback((screenName: string) => {
    emit({
      type: 'screen_open',
      screenName,
      timestamp: Date.now(),
    });
  }, []);

  const trackRouteChange = useCallback((from: string, to: string) => {
    emit({
      type: 'route_change',
      from,
      to,
      timestamp: Date.now(),
    });
  }, []);

  return {
    trackScreenView,
    trackRouteChange,
    currentPath: pathname,
    segments,
    navigationRef,
  };
}

export function useNavigationTiming(from: string, to: string) {
  const startTimeRef = useRef(() => performance.now());

  useEffect(() => {
    startTimeRef.current = () => performance.now();
  }, [to]);

  useEffect(() => {
    const duration = performance.now() - startTimeRef.current();
    emit({
      type: 'navigation_time',
      from,
      to,
      duration,
    });
  }, [from, to]);
}
