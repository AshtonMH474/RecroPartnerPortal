import React, { useEffect, useRef, useState, useMemo } from 'react';
import IconRenderer from '../utils/IconRenderer';
import PlusMinusButton from '../Cards/PlusMinus';
import { useWindowResize } from '@/hooks/useWindowResize';

const Card = React.memo(function Card({ card }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const isSmallScreen = useWindowResize(768);

  useEffect(() => {
    if (contentRef.current) {
      const section = contentRef.current;
      const baseHeight = section.scrollHeight;
      section.style.setProperty('--collapse-height', expanded ? `${baseHeight}px` : `0px`);
    }
  }, [expanded, card]);

  // 🗂️ Map flat deal fields
  const { name = 'No Name', agency = 'N/A', description = 'No description provided.' } = card || {};

  const agencies = useMemo(
    () =>
      agency
        .split(';')
        .map((a) => a.trim())
        .filter(Boolean),
    [agency]
  );

  return (
    <div
      data-testid="deal-card"
      data-expanded={expanded}
      className="bg-[#1A1A1E] rounded-xl w-[100%] border border-white/15 overflow-hidden transition-all duration-500 ease-in-out shadow-lg hover:shadow-primary/30"
    >
      <div className="flex justify-between items-start p-2 md:p-5 gap-5">
        <div className="flex gap-x-2 md:gap-x-4">
          <div className="md:w-[70px] md:h-[70px] w-[40px] h-[40px] bg-primary rounded-lg flex justify-center items-center flex-shrink-0">
            <IconRenderer
              size={isSmallScreen ? '28px' : '44px'}
              color="#FAF3E0"
              iconName={'FaHandshake'}
            />
          </div>
          <div className="flex flex-col flex-1 ">
            <h2 className="break-words font-bold  text-[14px] md:text-[22px] text-white flex-1 min-w-[150px]   ">
              {name}
            </h2>
            {agencies?.[0] && (
              <div className="flex flex-wrap items-center pt-2 gap-2">
                {agencies?.map((a, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 md:px-4 md:py-2 bg-[#2C2C33] text-gray-100 rounded-full border border-white/10 md:text-sm text-[12px] flex items-center justify-center"
                  >
                    {a}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div data-testid="deal-card-expand" className="flex items-start flex-shrink-0">
          <PlusMinusButton expanded={expanded} setExpanded={setExpanded} />
        </div>
      </div>
      <section
        ref={contentRef}
        className="collapse__content transition-[max-height,opacity] duration-500 ease-in-out px-5 pb-2"
        style={{
          maxHeight: expanded ? 'var(--collapse-height)' : '0',
          overflow: 'hidden',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="border-t border-white/10 pt-4 mt-2 space-y-3 text-[12px] md:text-sm text-gray-300">
          {description && (
            <p className="leading-relaxed break-words">
              <strong className="text-white/80 ">Description:</strong> {description}
            </p>
          )}
        </div>
      </section>
    </div>
  );
});

export default Card;
