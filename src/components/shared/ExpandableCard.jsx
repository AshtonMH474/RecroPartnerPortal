import { memo, useMemo, useCallback } from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { BsDownload } from 'react-icons/bs';
import { tinaField } from 'tinacms/dist/react';
import IconRenderer from '@/components/utils/IconRenderer';
import PlusMinusButton from '@/components/Cards/PlusMinus';
import { useWindowResize } from '@/hooks/useWindowResize';
import { useCollapsibleContent } from '@/hooks/useCollapsibleContent';

/**
 * Unified ExpandableCard component for Materials, Deals, and Tickets
 * @param {Object} props
 * @param {Object} props.card - Card data object
 * @param {'material'|'deal'|'ticket'} props.variant - Card type variant
 * @param {Function} props.onDownload - Download handler (material variant)
 * @param {Function} props.onViewMobile - Mobile view handler (material variant)
 * @param {Object} props.metadata - Additional metadata to display
 */
function ExpandableCard({ card, variant = 'material', onDownload, onViewMobile }) {
  const isSmallScreen = useWindowResize(768);
  const { expanded, toggleExpanded, contentRef } = useCollapsibleContent();

  // Extract data based on variant
  const cardData = useMemo(() => {
    switch (variant) {
      case 'material':
        return {
          title: card.title,
          icon: card.category?.icon,
          iconColor: '#FAF3E0',
          description: card.description,
          dateLabel: 'Updated Last',
          date: card.lastUpdated
            ? new Date(card.lastUpdated).toLocaleString('en-US', {
                month: 'short',
                year: 'numeric',
              })
            : 'N/A',
        };

      case 'deal':
        return {
          title: card.name || 'No Name',
          icon: 'FaHandshake',
          iconColor: '#FAF3E0',
          description: card.description || 'No description provided.',
          tags: card.agency
            ? card.agency
                .split(';')
                .map((a) => a.trim())
                .filter(Boolean)
            : [],
        };

      case 'ticket': {
        const stageMap = {
          1: { label: 'New', color: '#4ade80' },
          2: { label: 'Waiting on You', color: '#d4a017' },
          3: { label: 'Waiting on Us', color: '#f87171' },
          4: { label: 'Closed', color: '#a1a1aa' },
        };
        const stage = stageMap[card.properties?.hs_pipeline_stage] || {
          label: 'Unknown',
          color: '#6b7280',
        };
        const progressPercent = (card.properties?.hs_pipeline_stage / 4) * 100;

        return {
          title: card.properties?.subject,
          icon: 'FaRegCheckCircle',
          iconColor: '#FAF3E0',
          description: card.properties?.content,
          stage,
          progressPercent,
          agency: card.properties?.agency,
          amount: card.properties?.amount,
        };
      }

      default:
        return {};
    }
  }, [card, variant]);

  // Memoize download handler
  const handleDownload = useCallback(() => {
    if (onDownload) onDownload(card);
  }, [card, onDownload]);

  const handleViewMobile = useCallback(() => {
    if (onViewMobile) onViewMobile(card);
  }, [card, onViewMobile]);

  return (
    <div className="bg-[#1A1A1E] rounded-xl w-[100%] border border-white/15 overflow-hidden transition-all duration-500 ease-in-out">
      <div
        className={`flex justify-between ${variant === 'ticket' ? 'items-start p-3 md:p-4 gap-4' : ''}`}
      >
        {/* Left Section: Icon + Content */}
        <div className={`flex ${variant === 'material' ? 'pl-4 pt-4' : 'gap-x-2 md:gap-x-4'}`}>
          {/* Icon */}
          <div className={variant === 'material' ? 'pt-[5px]' : ''}>
            <div
              data-tina-field={variant === 'material' ? tinaField(card, 'category') : undefined}
              className={`${
                variant === 'material'
                  ? 'md:w-[70px] md:h-[70px] w-[45px] h-[45px] mb-2'
                  : 'md:w-[70px] md:h-[70px] w-[40px] h-[40px]'
              } bg-primary rounded-lg flex justify-center items-center flex-shrink-0`}
            >
              <IconRenderer
                size={isSmallScreen ? '28px' : variant === 'deal' ? '44px' : '48px'}
                color={cardData.iconColor}
                iconName={cardData.icon}
              />
            </div>
          </div>

          {/* Title + Description */}
          <div
            className={`${variant === 'material' ? 'pl-4 w-[100%] relative bottom-1' : 'flex flex-col flex-1'}`}
          >
            {/* Title Row */}
            <div
              className={
                variant === 'ticket'
                  ? 'flex flex-col md:flex-row md:items-center pb-2 md:pb-0 gap-1 md:gap-3'
                  : ''
              }
            >
              <h2
                data-tina-field={variant === 'material' ? tinaField(card, 'title') : undefined}
                className={`font-bold ${
                  variant === 'material'
                    ? 'pb-2 md:pb-0 text-[14px] md:text-[22px]'
                    : variant === 'ticket'
                      ? 'text-[14px] md:text-[22px] text-white flex-1'
                      : 'break-words text-[14px] md:text-[22px] text-white flex-1 min-w-[150px]'
                }`}
              >
                {cardData.title}
              </h2>

              {/* Ticket Status Bar */}
              {variant === 'ticket' && (
                <div className="relative md:w-[200px] w-[150px] h-3 md:h-5 rounded-full bg-gray-800 shadow-inner overflow-hidden">
                  <div
                    className="h-3 md:h-5 rounded-full transition-all duration-500"
                    style={{
                      width: `${cardData.progressPercent}%`,
                      backgroundColor: cardData.stage.color,
                    }}
                  />
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <span className="text-[12px] font-semibold px-1 rounded bg-black/50 text-white text-center">
                      {cardData.stage.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Deal Tags */}
            {variant === 'deal' && cardData.tags?.length > 0 && (
              <div className="flex flex-wrap items-center pt-2 gap-2">
                {cardData.tags.map((tag, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 md:px-4 md:py-2 bg-[#2C2C33] text-gray-100 rounded-full border border-white/10 md:text-sm text-[12px] flex items-center justify-center"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Ticket Agency/Amount */}
            {variant === 'ticket' && !isSmallScreen && (cardData.agency || cardData.amount) && (
              <p className="text-sm flex flex-wrap items-center gap-1">
                {cardData.agency && <span className="text-gray-400">{cardData.agency}</span>}
                {cardData.agency && cardData.amount && <span className="text-gray-400">|</span>}
                {cardData.amount && (
                  <span className="text-gray-400">
                    Amount:{' '}
                    <span className="text-green-400 font-medium">
                      ${Number(cardData.amount).toLocaleString()}
                    </span>
                  </span>
                )}
              </p>
            )}

            {/* Material Description (Desktop) */}
            {variant === 'material' && (
              <>
                <section
                  ref={contentRef}
                  data-tina-field={tinaField(card, 'description')}
                  className="collapse__content transition-[max-height,opacity] duration-500 ease-in-out"
                >
                  <TinaMarkdown
                    content={cardData.description}
                    components={{
                      p: (p) => (
                        <p
                          className="hidden md:block text-[#C2C2BC] text-[12px] md:text-[14px]"
                          {...p}
                        />
                      ),
                    }}
                  />
                </section>
                <button
                  onClick={handleViewMobile}
                  className="md:hidden bg-primary text-[14px] capitalize cursor-pointer px-4 py-1 w-auto rounded hover:opacity-80 text-white"
                >
                  View
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Section: Actions */}
        {variant === 'material' && (
          <div className="whitespace-nowrap flex flex-col gap-y-2">
            <h3 className="pr-4 pt-1 flex text-[12px] md:text-[14px] text-[#C2C2BC]">
              {cardData.dateLabel}: {cardData.date}
            </h3>
            <div className="md:pb-11 pb-7 flex items-center justify-center pl-20 md:pl-14 gap-x-2">
              <BsDownload
                onClick={handleDownload}
                className="text-[24px] md:text-[32px] cursor-pointer"
              />
              <div className="hidden md:block">
                <PlusMinusButton expanded={expanded} setExpanded={toggleExpanded} />
              </div>
            </div>
          </div>
        )}

        {/* Deal/Ticket Expand Button */}
        {(variant === 'deal' || variant === 'ticket') && (
          <div className="flex items-start flex-shrink-0">
            <PlusMinusButton expanded={expanded} setExpanded={toggleExpanded} />
          </div>
        )}
      </div>

      {/* Collapsible Description (Deal/Ticket) */}
      {(variant === 'deal' || variant === 'ticket') && (
        <section
          ref={contentRef}
          className={`collapse__content transition-[max-height,opacity] duration-500 ease-in-out ${
            variant === 'deal' ? 'px-5 pb-2' : 'px-4'
          }`}
          style={{
            maxHeight: expanded ? 'var(--collapse-height)' : '0',
            overflow: 'hidden',
            opacity: expanded ? 1 : 0,
          }}
        >
          {variant === 'deal' && cardData.description && (
            <div className="border-t border-white/10 pt-4 mt-2 space-y-3 text-[12px] md:text-sm text-gray-300">
              <p className="leading-relaxed break-words">
                <strong className="text-white/80">Description:</strong> {cardData.description}
              </p>
            </div>
          )}

          {variant === 'ticket' && cardData.description && (
            <p className="text-gray-300 text-sm mt-2 break-words pb-2">{cardData.description}</p>
          )}
        </section>
      )}
    </div>
  );
}

export default memo(ExpandableCard);
