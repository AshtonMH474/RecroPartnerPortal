import { useEffect, useRef, useState } from 'react';
import IconRenderer from '../utils/IconRenderer';
import PlusMinusButton from '../Cards/PlusMinus';
import { useWindowResize } from '@/hooks/useWindowResize';

function Card({ card }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const isSmallScreen = useWindowResize(768);

  useEffect(() => {
    if (contentRef.current) {
      const section = contentRef.current;
      const extra = 0;
      const baseHeight = section.scrollHeight;

      section.style.setProperty(
        '--collapse-height',
        expanded ? `${baseHeight + extra}px` : `${extra}px`
      );
    }
  }, [expanded]);

  const { subject, content, agency, amount, hs_pipeline_stage } = card?.properties || {};

  // Map stage to label and color
  const stageMap = {
    1: { label: 'New', color: '#4ade80' }, // green
    2: { label: 'Waiting on You', color: '#d4a017' }, // darker yellow
    3: { label: 'Waiting on Us', color: '#f87171' }, // red
    4: { label: 'Closed', color: '#a1a1aa' }, // gray
  };

  const stage = stageMap[hs_pipeline_stage] || { label: 'Unknown', color: '#6b7280' };
  const progressPercent = (hs_pipeline_stage / 4) * 100;

  return (
    <div className="bg-[#1A1A1E] rounded-xl w-[100%] border border-white/15 overflow-hidden transition-all duration-500 ease-in-out shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start p-3 md:p-4 gap-4">
        {/* Icon */}
        <div className="md:w-[70px] md:h-[70px] w-[40px] h-[40px] bg-primary rounded-lg flex justify-center items-center flex-shrink-0">
          <IconRenderer
            size={isSmallScreen ? '28px' : '48px'}
            color="#FAF3E0"
            iconName={'FaRegCheckCircle'}
          />
        </div>

        {/* Title + Status */}
        <div className="flex flex-col flex-1">
          <div className="flex flex-col md:flex-row md:items-center pb-2 md:pb-0 gap-1 md:gap-3">
            <h2 className="font-bold pb-1 text-[14px] md:text-[22px] text-white flex-1">
              {subject}
            </h2>

            {/* Status Bar */}
            <div className="relative md:w-[200px] w-[150px] h-3 md:h-5 rounded-full bg-gray-800 shadow-inner overflow-hidden">
              <div
                className="h-3 md:h-5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%`, backgroundColor: stage.color }}
              ></div>
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <span className="text-[12px] font-semibold px-1 rounded bg-black/50 text-white text-center">
                  {stage.label}
                </span>
              </div>
            </div>
          </div>

          {/* Agency | Amount */}
          {!isSmallScreen && [agency, amount].some(Boolean) && (
            <p className="text-sm flex flex-wrap items-center gap-1">
              {agency && <span className="text-gray-400">{agency}</span>}
              {agency && amount && <span className="text-gray-400">|</span>}
              {amount && (
                <span className="text-gray-400">
                  Amount:{' '}
                  <span className="text-green-400 font-medium">
                    ${Number(amount).toLocaleString()}
                  </span>
                </span>
              )}
            </p>
          )}
        </div>

        {/* Expand Button */}
        <div className="flex items-start flex-shrink-0">
          <PlusMinusButton expanded={expanded} setExpanded={setExpanded} />
        </div>
      </div>

      {/* Collapsible Content */}
      <section
        ref={contentRef}
        className="collapse__content transition-[max-height,opacity] duration-500 ease-in-out px-4"
        style={{ maxHeight: expanded ? 'var(--collapse-height)' : '0', overflow: 'hidden' }}
      >
        <p className="text-gray-300 text-sm mt-2 break-words pb-2">{content}</p>
      </section>
    </div>
  );
}

export default Card;
