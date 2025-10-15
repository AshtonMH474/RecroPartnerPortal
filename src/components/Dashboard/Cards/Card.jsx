import IconRenderer from "@/components/utils/IconRenderer";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { BsDownload } from "react-icons/bs";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlusMinusButton from "./PlusMinus";
import { downloadPdf } from "@/lib/download";
import { useAuth } from "@/context/auth";

function Card({ card }) {
  const {user} = useAuth()
  const [expanded, setExpanded] = useState(false);
  function changeTime(date) {
    const d = new Date(date);
    return d.toLocaleString("en-US", { month: "short", year: "numeric" });
  }

  return (
    <motion.div
      className="bg-[#1A1A1E] rounded-xl w-[95%] border border-white/15 overflow-hidden"
      layout
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex justify-between">
        <div className="flex pl-4 pt-4">
          <div className="w-[70px] h-[70px] mb-4 bg-primary rounded-lg flex justify-center items-center">
            <IconRenderer
              size={"48px"}
              color={"#FAF3E0"}
              iconName={card.category.icon}
            />
          </div>

          <div className="pl-4 w-[100%] relative bottom-1">
            <h2 className="font-bold text-[22px]">{card.title}</h2>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <TinaMarkdown
                    content={card.description}
                    components={{
                      p: (p) => <p className="text-[#C2C2BC] text-[14px]" {...p} />,
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                >
                  <TinaMarkdown
                    content={card.description}
                    components={{
                      p: (p) => (
                        <p className="text-[#C2C2BC] text-[14px] truncate-3" {...p} />
                      ),
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="whitespace-nowrap flex flex-col gap-y-2">
          <h3 className="pr-4 pt-1 flex text-[14px] text-[#C2C2BC] ">
            Updated Last: {changeTime(card.lastUpdated)}
          </h3>
          <div className="flex items-center justify-center pl-14 gap-x-2">
            <BsDownload onClick={() => downloadPdf(card,user)} className="text-[32px] cursor-pointer" />
            <PlusMinusButton expanded={expanded} setExpanded={setExpanded} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
