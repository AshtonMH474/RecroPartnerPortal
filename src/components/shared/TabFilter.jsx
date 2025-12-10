import { memo } from "react";
import { tinaField } from "tinacms/dist/react";
import IconRenderer from "@/components/utils/IconRenderer";
import { useWindowResize } from "@/hooks/useWindowResize";

/**
 * Reusable TabFilter component for tab/type selection
 * Replaces Activity/Types.jsx and Dashboard/Filters.jsx
 *
 * @param {Object} props
 * @param {Array} props.tabs - Array of tab objects with { filter, label, icon }
 * @param {string} props.active - Currently active filter value
 * @param {Function} props.setActive - Callback to update active filter
 * @param {Array} props.recent - Optional recent items array (hides 'recent' tab if empty)
 * @param {boolean} props.useTinaFields - Whether to use TinaCMS field integration
 */
function TabFilter({
  tabs = [],
  active,
  setActive,
  recent = null,
  useTinaFields = true
}) {
  const isSmallScreen = useWindowResize(768);

  return (
    <div className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-4">
      {tabs.map((tab, i) => {
        // Hide 'recent' tab if recent array is empty
        if (tab.filter === "recent" && recent?.length === 0) return null;

        const isActive = tab.filter === active;
        const baseClasses = "text-[14px] md:text-[18px] lg:text-[22px] px-3 md:px-4 lg:px-6 h-10 md:h-12 lg:h-15 rounded-full border border-white/15 transition-colors duration-300 ease-in-out flex items-center justify-center gap-x-2 cursor-pointer";
        const activeClasses = "bg-primary";
        const inactiveClasses = "bg-[#1A1A1E]";

        return (
          <button
            key={i}
            data-tina-field={useTinaFields ? tinaField(tab, 'label') : undefined}
            onClick={() => setActive(tab.filter)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            {tab.icon && (
              <IconRenderer
                size={isSmallScreen ? "14px" : "22px"}
                color="#FFFFFF"
                iconName={tab.icon}
              />
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(TabFilter);
