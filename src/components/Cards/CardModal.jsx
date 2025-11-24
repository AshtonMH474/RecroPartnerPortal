import {motion} from "framer-motion";
import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { downloadPdf } from "@/lib/download";
import { useAuth } from "@/context/auth";
import { useCallback, useEffect } from "react";
function CardModal({ card,onClose }) {
    const { user } = useAuth();
    const handleDownload = useCallback(() => {
        downloadPdf(card, user);
    }, [card, user]);

    useEffect(() => {
        const scrollY = window.scrollY;
    
        // Lock scroll and preserve current position
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100%';
    
        return () => {
          // Restore scroll position
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.overflow = '';
          document.body.style.width = '';
          window.scrollTo(0, scrollY); // restore to the same spot
        };
    }, []);

    return (
        <div
        className="fixed inset-0 flex justify-center items-center z-[1000]"
        onClick={onClose}>
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm z-[999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            />
            {/* Modal Content */}
            <motion.div
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="
            relative z-[1000] 
            border border-white/15 rounded-[12px] bg-[#1A1A1E] 
            w-[90%] sm:w-[70%] md:w-[50%] 
            max-h-[80vh] 
            p-6 md:p-8 
            overflow-y-auto
            flex flex-col
            "
            >
                <div className="mb-4 text-center">
                    <h2 data-tina-field={tinaField(card,'title')} className="text-2xl pb-2 md:text-3xl font-bold text-white">{card.title}</h2>
                    <TinaMarkdown
                        data-tina-field={tinaField(card,'description')}
                        content={card.description}
                        components={{
                        p: (p) => (
                            <p className="text-white/70 text-sm md:text-base leading-relaxed space-y-4 text-center" {...p} />
                        ),
                        }}
                    />
                </div>
                <div className="flex justify-center gap-x-4">
                    <button className="bg-primary text-[16px] text-white px-4 py-1 rounded hover:opacity-80 transition-colors duration-300 cursor-pointer " onClick={handleDownload}>Download</button>
                    <button className="px-4 text-[16px] capitalize py-1 border primary-border rounded hover:text-white/80 transition-colors duration-300 cursor-pointer" onClick={onClose}>Close</button>
                </div>
            </motion.div>
        </div>
    )
}

export default CardModal;