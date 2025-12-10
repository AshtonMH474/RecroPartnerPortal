import { useState, useEffect } from 'react';

/**
 * Custom hook to detect window resize and check if screen width is below a breakpoint
 * @param {number} breakpoint - The pixel width to check against (default: 768)
 * @returns {boolean} - Returns true if window width is below breakpoint
 *
 * @example
 * const isSmallScreen = useWindowResize(768);
 * const isMobile = useWindowResize(640);
 */
export function useWindowResize(breakpoint = 768) {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < breakpoint);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isSmall;
}
