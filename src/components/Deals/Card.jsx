import { useEffect, useRef, useState } from "react";
import IconRenderer from "../utils/IconRenderer";
import PlusMinusButton from "../Cards/PlusMinus";

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
    agency = "N/A",
    description = "No description provided.",
  } = card || {};

  const agencies = agency.split(";").map(a => a.trim()).filter(Boolean);


  return (
      <div className="bg-[#1A1A1E] rounded-xl w-[95%] border border-white/15 overflow-hidden transition-all duration-500 ease-in-out shadow-lg hover:shadow-primary/30">
            <div className="flex justify-between items-start p-5 gap-5">
                <div className="flex gap-x-4">
                      <div className="w-[70px] h-[70px] bg-primary rounded-lg flex justify-center items-center flex-shrink-0">
                          <IconRenderer size="44px" color="#FAF3E0" iconName={"FaHandshake"} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                            <h2 className="break-words font-bold text-[22px] text-white flex-1 min-w-[150px]   ">
                              {name}
                            </h2>
                            {agencies?.[0] && (<div className="flex flex-wrap items-center pt-2 gap-2">
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
                </div>
                <div className="flex items-start flex-shrink-0">
                  <PlusMinusButton expanded={expanded} setExpanded={setExpanded} />
                </div>
                
            </div>
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
                  <p className="leading-relaxed break-words">
                    <strong className="text-white/80 ">Description:</strong>{" "}
                    {description}
                  </p>
                )}
            </div>
            
          </section>
      </div>
  );
}

export default Card;
