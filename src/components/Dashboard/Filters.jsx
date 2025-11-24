import { memo ,useEffect, useState} from "react";
import { tinaField } from "tinacms/dist/react";
import IconRenderer from "../utils/IconRenderer";


function Filters({ props, setActive, active, recent }) {
  const filters = props?.options || props?.filters || [];
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", () => {
      setIsSmallScreen(window.innerWidth < 768);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setIsSmallScreen(window.innerWidth < 768);
      });
    };
  }, []);
  return (
    <> 
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        {filters.map((filter, i) => {
          if (filter.filter === "recent" && recent?.length === 0) return null;

          const isActive = filter.filter === active;
          const baseClasses =
            "text-[14px] lg:text-[22px] px-4 md:px-6 h-10 md:h-12 lg:h-15 rounded-full border border-white/15 transition-colors duration-300 ease-in-out flex items-center justify-center gap-x-2 cursor-pointer";
          const activeClasses = "bg-primary";
          const inactiveClasses = "bg-[#1A1A1E]";

          return (
            <button
              key={i}
              data-tina-field={tinaField(filter, "label")}
              onClick={() => setActive(filter.filter)}
              className={`${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`}
            >
              <IconRenderer
                size={isSmallScreen ? "14px" : "22px"}
                color={"#FFFFFF"}
                iconName={filter.icon}
              />
              <span className="">{filter.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

// Prevent unnecessary re-renders if props haven’t changed
export default memo(Filters);
