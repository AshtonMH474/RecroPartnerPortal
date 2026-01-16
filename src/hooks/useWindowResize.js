import { useSyncExternalStore, useCallback } from 'react';

/**
 * Custom hook to detect window resize and check if screen width is below a breakpoint
 * Uses useSyncExternalStore for better React 18 compatibility and avoids
 * the set-state-in-effect ESLint warning
 *
 * @param {number} breakpoint - The pixel width to check against (default: 768)
 * @returns {boolean} - Returns true if window width is below breakpoint
 *
 * @example
 * const isSmallScreen = useWindowResize(768);
 * const isMobile = useWindowResize(640);
 */
export function useWindowResize(breakpoint = 768) {
  const subscribe = useCallback((callback) => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return window.innerWidth < breakpoint;
  }, [breakpoint]);

  const getServerSnapshot = useCallback(() => {
    // Default to false on server (SSR)
    return false;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
