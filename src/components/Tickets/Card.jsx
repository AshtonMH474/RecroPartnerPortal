import { useEffect, useRef, useState } from "react";
import IconRenderer from "../utils/IconRenderer";
import PlusMinusButton from "../Dashboard/Cards/PlusMinus";

function Card({ card }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);


  useEffect(() => {
    if (contentRef.current) {
      const section = contentRef.current;
      const extra = 0;
      const baseHeight = section.scrollHeight;

      section.style.setProperty(
        "--collapse-height",
        expanded ? `${baseHeight + extra}px` : `${extra}px`
      );
    }
  }, [expanded]);

  const {
    subject,
    content,
    agency,
    amount,
    category,
    type,
    hs_pipeline_stage,
    createdate,
  } = card.properties;

  // Map stage to label and color
  const stageMap = {
    1: { label: "New", color: "#4ade80" }, // green
    2: { label: "Waiting on You", color: "#d4a017" }, // darker yellow
    3: { label: "Waiting on Us", color: "#f87171" }, // red
    4: { label: "Closed", color: "#a1a1aa" }, // gray
  };

  const stage = stageMap[hs_pipeline_stage] || { label: "Unknown", color: "#6b7280" };
  const progressPercent = (hs_pipeline_stage / 4) * 100;

  return (
    <div className="bg-[#1A1A1E] rounded-xl w-[95%] border border-white/15 overflow-hidden transition-all duration-500 ease-in-out shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start p-4 gap-4">
        {/* Icon */}
        <div className="w-[70px] h-[70px] bg-primary rounded-lg flex justify-center items-center">
          <IconRenderer size="48px" color="#FAF3E0" iconName={card.properties.iconname} />
        </div>

        {/* Title + Status */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-[22px] text-white flex-1">{subject}</h2>

            {/* Status Bar */}
            <div className="relative w-[200px] h-5 rounded-full bg-gray-800 shadow-inner overflow-hidden">
              <div
                className="h-5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%`, backgroundColor: stage.color }}
              ></div>
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <span className="text-[12px] font-semibold px-1 rounded bg-black/50 text-white text-center">
                  {stage.label}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-1">{category} | {type}</p>
          <p className="text-sm text-gray-400">{agency} | ${amount}</p>
        </div>

        {/* Expand Button */}
        <div className="flex items-start">
          <PlusMinusButton expanded={expanded} setExpanded={setExpanded} />
        </div>
      </div>

      {/* Collapsible Content */}
      <section
        ref={contentRef}
        className="collapse__content transition-[max-height,opacity] duration-500 ease-in-out px-4"
        style={{ maxHeight: expanded ? "var(--collapse-height)" : "0", overflow: "hidden" }}
      >
        <p className="text-gray-300 text-sm mt-2">{content}</p>

        {/* Extra Ticket Details */}
        <div className="mt-4 m text-gray-400 text-sm space-y-1">
          <div className=""><strong>Created:</strong> {new Date(createdate).toLocaleString()}</div>
        </div>
      </section>
    </div>
  );
}

export default Card;

