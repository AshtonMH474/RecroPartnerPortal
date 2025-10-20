import { motion } from "framer-motion"
import IconRenderer from "../utils/IconRenderer"
import { tinaField } from "tinacms/dist/react"
import { IoLocationOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";
import { CiClock1 } from "react-icons/ci";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useEffect } from "react";



function OppModal({opp,onClose}){



    useEffect(() => {
    // Lock scrolling when modal opens
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    // ✅ Cleanup when modal unmounts or closes
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

    if (!opp) return null;

    
    return(
    <div
      className="fixed inset-0 z-[1000] flex justify-center items-center"
      onClick={onClose}
    >
        <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Modal Content */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        className="relative z-[1001] w-[90%] max-w-[1500px] max-h-[90%] overflow-y-auto bg-[#1A1A1E] rounded-[12px] p-6"
      >
        <div className="pl-4">
            <div className="flex justify-between">
                <div className="flex  gap-x-4">
                    <div className="w-[80px] h-[80px] mb-4 bg-primary rounded-lg flex justify-center items-center">
                        <IconRenderer
                        size={'58px'}
                        color={"#FAF3E0"}
                        iconName={opp.category.icon}
                        />
                    </div>
                    <div>
                        <h2 data-tina-field={tinaField(opp,'title')} className="font-bold text-[28px]">{opp.title}</h2>
                        <h3 data-tina-field={tinaField(opp,'agency')} className="text-[24px]">{opp.agency}</h3>
                    </div>
                            
                </div>
                <IoMdClose onClick={onClose} className="cursor-pointer text-white text-[24px] hover:text-primary transition" />
            </div>
            <div className="sm:flex gap-x-6">
                <h4 className="text-[20px] text-[#C2C2BC]">Type: {opp.type}</h4>
                <h4 className="text-[20px] text-[#C2C2BC] flex items-center"><IoLocationOutline className="text-[#22C55E]"/>Location: {opp.location}</h4>
            </div>
            <div className="flex flex-wrap lg:flex-row gap-y-3 pt-3 gap-x-4  pb-4">
                 <button className="bg-primary capitalize cursor-pointer text-[20px] px-4 py-2 w-auto rounded hover:opacity-80 text-white flex items-center gap-x-1">Save <MdSaveAlt className="text-[20px]"/></button>
                 <button className="px-4 capitalize py-2 border text-[20px] primary-border rounded hover:text-white/80 transition-colors duration-300">{opp.intrested}</button>
                 <button className="px-4 capitalize py-2 border text-[20px] border-[#B55914] rounded  flex gap-x-1 items-center justify-center"><MdOutlineDateRange className="text-[#2563EB]"/>Deadline: {new Date(opp.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</button>
                 <button className="px-4 capitalize py-2 border text-[20px] border-[#B55914] rounded  flex items-center gap-x-1 capitalize"><CiClock1 className="text-[#EAB308] text-[25px]"/>Status: {opp.status}</button>
            </div>
            <div>
                <TinaMarkdown content={opp.description}
                    components={{
                        p:(p) => <p className="text-[#C2C2BC] text-[14px] " {...p} />
                    }} />
            </div>
        </div>
        
      </motion.div>
    </div>
    )
}

export default OppModal