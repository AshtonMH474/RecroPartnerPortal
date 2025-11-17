import IconRenderer from "@/components/utils/IconRenderer";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { BsDownload } from "react-icons/bs";
import { useState, useRef, useEffect, memo, useMemo, useCallback } from "react";
import PlusMinusButton from "./PlusMinus";
import { downloadPdf } from "@/lib/download";
import { useAuth } from "@/context/auth";
import { tinaField } from "tinacms/dist/react";

function Card({ card }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);

  // ✅ Memoize date formatting
  const formattedDate = useMemo(() => {
    if (!card.lastUpdated) return "N/A";
    const d = new Date(card.lastUpdated);
    return d.toLocaleString("en-US", { month: "short", year: "numeric" });
  }, [card.lastUpdated]);

  // ✅ Memoize download handler
  const handleDownload = useCallback(() => {
    downloadPdf(card, user);
  }, [card, user]);

  // ✅ Optimize useEffect (only run when expanded changes)
  useEffect(() => {
    if (contentRef.current) {
      const section = contentRef.current;
      const baseHeight = section.scrollHeight;
      section.style.setProperty(
        "--collapse-height",
        expanded ? `${baseHeight}px` : `0px`
      );
    }
  }, [expanded]);

  return (
    <div
      className="bg-[#1A1A1E] rounded-xl w-[100%] border border-white/15 overflow-hidden transition-all duration-500 ease-in-out"
    >
      <div className="flex justify-between">
        <div className="flex pl-4 pt-4">
          <div className="pt-[5px]">
            <div
              data-tina-field={tinaField(card, "category")}
              className="w-[70px] h-[70px] mb-2 bg-primary rounded-lg flex justify-center items-center"
            >
              <IconRenderer
                size={"48px"}
                color={"#FAF3E0"}
                iconName={card.category?.icon}
              />
            </div>
          </div>

          <div className="pl-4 w-[100%] relative bottom-1">
            <h2
              data-tina-field={tinaField(card, "title")}
              className="font-bold text-[22px]"
            >
              {card.title}
            </h2>

            <section
              ref={contentRef}
              data-tina-field={tinaField(card, "description")}
              className="collapse__content transition-[max-height,opacity] duration-500 ease-in-out"
            >
              <TinaMarkdown
                content={card.description}
                components={{
                  p: (p) => (
                    <p className="text-[#C2C2BC] text-[14px]" {...p} />
                  ),
                }}
              />
            </section>
          </div>
        </div>

        <div className="whitespace-nowrap flex flex-col gap-y-2">
          <h3 className="pr-4 pt-1 flex text-[14px] text-[#C2C2BC]">
            Updated Last: {formattedDate}
          </h3>
          <div className="pb-11 flex items-center justify-center pl-14 gap-x-2">
            <BsDownload
              onClick={handleDownload}
              className="text-[32px] cursor-pointer"
            />
            <PlusMinusButton expanded={expanded} setExpanded={setExpanded} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Memoize Card component to prevent unnecessary re-renders
export default memo(Card);
