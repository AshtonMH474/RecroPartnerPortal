import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing collapsible/expandable content with smooth height transitions
 * Calculates and sets CSS custom property for dynamic height animations
 *
 * @param {boolean} initialExpanded - Initial expanded state (default: false)
 * @returns {Object} Collapsible content utilities
 *
 * @example
 * function Card() {
 *   const { expanded, toggleExpanded, contentRef } = useCollapsibleContent();
 *
 *   return (
 *     <div>
 *       <button onClick={toggleExpanded}>Toggle</button>
 *       <div
 *         ref={contentRef}
 *         style={{ height: expanded ? 'var(--collapse-height)' : '0px' }}
 *       >
 *         Content here
 *       </div>
 *     </div>
 *   );
 * }
 */
export function useCollapsibleContent(initialExpanded = false) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const contentRef = useRef(null);

  /**
   * Calculate and set the dynamic height CSS variable
   */
  useEffect(() => {
    if (contentRef.current) {
      const section = contentRef.current;
      const baseHeight = section.scrollHeight;

      section.style.setProperty(
        '--collapse-height',
        expanded ? `${baseHeight}px` : '0px'
      );
    }
  }, [expanded]);

  /**
   * Recalculate height when content changes (e.g., window resize)
   * This ensures the height is accurate even if content wraps differently
   */
  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (contentRef.current && expanded) {
        const baseHeight = contentRef.current.scrollHeight;
        contentRef.current.style.setProperty('--collapse-height', `${baseHeight}px`);
      }
    });

    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, [expanded]);

  /**
   * Toggle expanded state
   */
  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  /**
   * Set expanded state directly
   */
  const setExpandedState = (isExpanded) => {
    setExpanded(isExpanded);
  };

  return {
    expanded,
    setExpanded: setExpandedState,
    toggleExpanded,
    contentRef,
  };
}
