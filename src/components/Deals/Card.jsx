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

  // Map your flat deal fields
  const {
    name = "No Name",
    amount = "0",
    stage = "unknown",
    pipeline = "default",
    closeDate = null,
    lastUpdated = null,
    id,
  } = card || {};

  // Map stage to label and color
  const stageMap = {
    appointmentscheduled: { label: "Appointment Scheduled", color: "#4ade80" },
    qualifiedtobuy: { label: "Qualified to Buy", color: "#d4a017" },
    decisionmakerboughtin: { label: "Decision Maker Bought In", color: "#f87171" },
    contractsent: { label: "Contract Sent", color: "#a1a1aa" },
    closedwon: { label: "Closed Won", color: "#22c55e" },
    closedlost: { label: "Closed Lost", color: "#ef4444" },
  };

  const stageInfo = stageMap[stage] || { label: "Unknown", color: "#6b7280" };

  // Optional progress bar
  const progressPercent = Object.keys(stageMap).indexOf(stage) / Object.keys(stageMap).length * 100;

  return (
    <div className="bg-[#1A1A1E] rounded-xl w-[95%] border border-white/15 overflow-hidden transition-all duration-500 ease-in-out shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start p-4 gap-4">
        {/* Icon */}
        <div className="w-[70px] h-[70px] bg-primary rounded-lg flex justify-center items-center">
          <IconRenderer size="48px" color="#FAF3E0" iconName={"FaHandsHelping"} />
        </div>

        {/* Title + Status */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-[22px] text-white flex-1">{name}</h2>

            {/* Status Bar */}
            <div className="relative w-[200px] h-5 rounded-full bg-gray-800 shadow-inner overflow-hidden">
              <div
                className="h-5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%`, backgroundColor: stageInfo.color }}
              ></div>
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <span className="text-[12px] font-semibold px-1 rounded bg-black/50 text-white text-center">
                  {stageInfo.label}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-1">{pipeline}</p>
          <p className="text-sm text-gray-400">${amount}</p>
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
        {closeDate && (
          <div className="mt-4 text-gray-400 text-sm">
            <strong>Close Date:</strong> {new Date(closeDate).toLocaleString()}
          </div>
        )}
        {lastUpdated && (
          <div className="mt-1 text-gray-400 text-sm">
            <strong>Last Updated:</strong> {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
      </section>
    </div>
  );
}

export default Card;
