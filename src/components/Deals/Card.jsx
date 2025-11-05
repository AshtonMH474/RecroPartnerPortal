import { useEffect, useRef, useState } from "react";
import IconRenderer from "../utils/IconRenderer";
import PlusMinusButton from "../Dashboard/Cards/PlusMinus";

function Card({ card }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const section = contentRef.current;
      const baseHeight = section.scrollHeight;
      section.style.setProperty(
        "--collapse-height",
        expanded ? `${baseHeight}px` : `0px`
      );
    }
  }, [expanded, card]);

  // 🗂️ Map flat deal fields
  const {
    name = "No Name",
    amount = "0",
    stage = "unknown",
    pipeline = "default",
    agency = "N/A",
    typeOfWork = "N/A",
    description = "No description provided.",
    closeDate = null,
    lastUpdated = null,
  } = card || {};

  // 🎯 Stage mapping for label + color
  const stageMap = {
    appointmentscheduled: { label: "Appointment Scheduled", color: "#4ade80" },
    qualifiedtobuy: { label: "Qualified to Buy", color: "#d4a017" },
    decisionmakerboughtin: { label: "Decision Maker Bought In", color: "#f87171" },
    contractsent: { label: "Contract Sent", color: "#a1a1aa" },
    closedwon: { label: "Closed Won", color: "#22c55e" },
    closedlost: { label: "Closed Lost", color: "#ef4444" },
  };

  const stageInfo = stageMap[stage] || { label: "Unknown", color: "#6b7280" };

  // Split multiple values (e.g. "NRO;NGA" -> ["NRO", "NGA"])
  const agencies = agency.split(";").map(a => a.trim()).filter(Boolean);
//   const workTypes = typeOfWork.split(";").map(w => w.trim()).filter(Boolean);

  return (
    <div className="bg-[#1A1A1E] rounded-xl w-[95%] border border-white/15 overflow-hidden transition-all duration-500 ease-in-out shadow-lg hover:shadow-primary/30">
      {/* Header */}
      <div className="flex justify-between items-start p-5 gap-5">
        {/* Icon */}
        <div className="w-[70px] h-[70px] bg-primary rounded-lg flex justify-center items-center">
          <IconRenderer size="44px" color="#FAF3E0" iconName={"FaHandshake"} />
        </div>

        {/* Title + Status */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold text-[22px] text-white flex-1 min-w-[150px]">
              {name}
            </h2>

            <div className="pl-20">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold px-2 py-1 rounded-full">
                  Status: {stageInfo.label}
                </span>
              </div>
            </div>
          </div>

        {closeDate && (
            <p className="text-sm text-gray-400 mt-1 capitalize">
              Close Date:{""} {new Date(closeDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                })}
            </p>
          )}
        
            {amount > 0 && (<p className="text-sm text-gray-400">
            Amount:{" "}
            <span
                className={`font-medium text-green-400 font-bold`}
            >
                ${Number(amount).toLocaleString()}
            </span>
            </p>)}
        </div>

        {/* Expand Button */}
        <PlusMinusButton expanded={expanded} setExpanded={setExpanded} />
      </div>

      {/* Collapsible Section */}
      <section
        ref={contentRef}
        className="collapse__content transition-[max-height,opacity] duration-500 ease-in-out px-5 pb-2"
        style={{
          maxHeight: expanded ? "var(--collapse-height)" : "0",
          overflow: "hidden",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="border-t border-white/10 pt-4 mt-2 space-y-3 text-sm text-gray-300">
          {description && (
            <p className="leading-relaxed">
              <strong className="text-white/80">Description:</strong>{" "}
              {description}
            </p>
          )}
        <div className=" flex flex-col gap-y-2">
                    {/* Agencies */}
            {agencies?.[0] && (<div className="flex flex-wrap items-center gap-2">
            <strong className="text-white/80">Agencies:</strong>
            {agencies?.map((a, i) => (
                <div
                key={i}
                className="px-4 py-2 bg-[#2C2C33] text-gray-100 rounded-full border border-white/10 text-sm flex items-center justify-center"
                >
                {a}
                </div>
            ))}
            </div>)}


        </div>
          
          {lastUpdated && (
            <p>
              <strong className="text-white/80">Last Updated:</strong>{" "}
              {new Date(lastUpdated).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                })}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Card;
