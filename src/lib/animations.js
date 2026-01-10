/**
 * Shared animation variants for Framer Motion
 * Used across modal components for consistent animations
 */

// Modal backdrop fade animation
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

// Modal content slide-up animation
export const modalContentVariants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.4 }
};

// Page/card slide animation (used in AllDeals, Materials, MyDeals)
export const pageSlideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};
