import { useEffect } from 'react';

/**
 * Custom hook to lock/prevent scrolling on the body element
 * Useful for modals, drawers, and overlays
 * Automatically restores scroll position when unmounted
 *
 * @example
 * function Modal() {
 *   useScrollLock(); // Locks scroll while modal is mounted
 *   return <div>Modal Content</div>;
 * }
 */
export function useScrollLock() {
  useEffect(() => {
    // Store current scroll position
    const scrollY = window.scrollY;

    // Store original body styles
    const originalStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      overflow: document.body.style.overflow,
      width: document.body.style.width,
    };

    // Lock scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';

    // Cleanup: restore original styles and scroll position
    return () => {
      Object.assign(document.body.style, originalStyles);
      window.scrollTo(0, scrollY);
    };
  }, []);
}
