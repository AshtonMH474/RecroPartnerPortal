import { useState, useEffect } from "react";

/**
 * Custom hook to detect mobile view
 * @param {number} breakpoint - Breakpoint in pixels (default: 1024 for Tailwind's lg breakpoint)
 * @returns {boolean} - true if screen width is below breakpoint (mobile), false otherwise
 */
export function useMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check on mount and set initial value
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial value (handles SSR)
    if (typeof window !== "undefined") {
      checkMobile();
    }

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Custom hook to detect specific screen sizes
 * @param {Object} breakpoints - Object with breakpoint names and values
 * @returns {Object} - Object with boolean values for each breakpoint
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoints({
 *   isMobile: 640,   // sm
 *   isTablet: 1024,  // lg
 *   isDesktop: 1280  // xl
 * });
 */
export function useBreakpoints(breakpoints) {
  const [matches, setMatches] = useState({});

  useEffect(() => {
    const checkBreakpoints = () => {
      const newMatches = {};
      Object.keys(breakpoints).forEach((key) => {
        newMatches[key] = window.innerWidth < breakpoints[key];
      });
      setMatches(newMatches);
    };

    if (typeof window !== "undefined") {
      checkBreakpoints();
      window.addEventListener("resize", checkBreakpoints);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkBreakpoints);
      }
    };
  }, [breakpoints]);

  return matches;
}

/**
 * Custom hook to get current window width
 * @returns {number} - Current window width in pixels
 */
export function useWindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      updateWidth();
      window.addEventListener("resize", updateWidth);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateWidth);
      }
    };
  }, []);

  return width;
}

