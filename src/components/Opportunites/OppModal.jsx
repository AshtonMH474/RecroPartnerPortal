import { AnimatePresence, motion } from "framer-motion";
import IconRenderer from "../utils/IconRenderer";
import { tinaField } from "tinacms/dist/react";
import { IoLocationOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { MdSaveAlt, MdOutlineDateRange } from "react-icons/md";
import { CiClock1 } from "react-icons/ci";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { deleteOpp, saveOpp } from "@/lib/auth_functions";
import { Check, X } from "lucide-react";

import DealFormModal from "../DealForm";

function OppModal({ opp, onClose, onSaveChange }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(opp?.saved == true);
  const [hovered, setHovered] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);


  async function save(intrested) {
    try {
      let data = await saveOpp(user, opp, intrested);
      onSaveChange?.(true);
      if (intrested) setMessage(data);
    } catch (e) {
      alert("There was an Error Saving: " + e);
    }
  }

  async function deleteSave() {
    try {
      await deleteOpp(user, opp?._sys?.relativePath);
      setChecked(false);
      onSaveChange?.(false);
    } catch (e) {
      alert("There was an Error Saving: " + e);
    }
  }

  // Lock scroll while modal is open
  useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  useEffect(() => {
    setChecked(opp?.saved == true);
  }, [opp]);

  const handleOpenForm = async() => {
    
   
    await setShowFormModal(true) // open IntrestedFormModal
  };

  if (!opp) return null;

  return (
    <>
      {/* Opp Modal */}
      <AnimatePresence>
        {opp && !showFormModal && (
          <motion.div
            className="fixed inset-0 z-[1000] flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="relative z-[1001] w-[90%] max-w-[1500px] max-h-[90%] overflow-y-auto bg-[#1A1A1E] rounded-[12px] p-6"
            >
              <div className="flex justify-between">
                <div className="flex gap-x-4">
                  <div className="w-[80px] h-[80px] mb-4 bg-primary rounded-lg flex justify-center items-center">
                    <IconRenderer
                      size={"58px"}
                      color={"#FAF3E0"}
                      iconName={opp.category.icon}
                    />
                  </div>
                  <div>
                    <h2 data-tina-field={tinaField(opp, "title")} className="font-bold text-[28px]">
                      {opp.title}
                    </h2>
                    <h3 data-tina-field={tinaField(opp, "agency")} className="text-[24px]">
                      {opp.agency}
                    </h3>
                  </div>
                </div>
                <IoMdClose
                  onClick={onClose}
                  className="cursor-pointer text-white text-[24px] hover:text-primary transition"
                />
              </div>

              <div className="sm:flex gap-x-6 mt-2">
                <h4 className="text-[20px] text-[#C2C2BC]">Type: {opp.type}</h4>
                <h4 className="text-[20px] text-[#C2C2BC] flex items-center">
                  <IoLocationOutline className="text-[#22C55E]" /> Location: {opp.location}
                </h4>
                <h4 className="text-[20px] text-[#C2C2BC] flex items-center">
                  Estimated Value: <span className="text-[#22C55E]">$</span> {opp.value?.toLocaleString()}
                </h4>
              </div>

              <div className="flex flex-wrap lg:flex-row gap-y-3 pt-3 gap-x-4 pb-4">
                <motion.button
                  onClick={() => {
                    if (!checked) save(false);
                    else deleteSave();
                    setChecked(!checked);
                  }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className={`capitalize cursor-pointer text-[20px] px-4 py-2 w-auto rounded flex items-center gap-x-1 border primary-border transition-all duration-300 ${
                    checked ? "bg-primary text-white border-primary" : "bg-transparent text-white border-gray-400 hover:opacity-80"
                  }`}
                >
                  {checked ? (
                    <motion.div
                      key={hovered ? "x" : "check"}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-x-1"
                    >
                      <span>{hovered ? "Unsave" : "Saved"}</span>
                      {hovered ? <X className="text-white w-5 h-5" /> : <Check className="text-white w-5 h-5" />}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unsaved"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-x-1"
                    >
                      <span>Save</span>
                      <MdSaveAlt className="text-[20px] relative bottom-[2px]" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Interested button opens new modal */}
                <button
                  onClick={handleOpenForm}
                  className="px-4 capitalize py-2 border text-[20px] primary-border rounded hover:text-white/80 transition-colors duration-300"
                >
                  Interested?
                </button>

                <button className="px-4 capitalize py-2 border text-[20px] border-[#B55914] rounded flex gap-x-1 items-center justify-center">
                  <MdOutlineDateRange className="text-[#2563EB]" />
                  Deadline: {new Date(opp.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </button>

                <button className="px-4 capitalize py-2 border text-[20px] border-[#B55914] rounded flex items-center gap-x-1 capitalize">
                  <CiClock1 className="text-[#EAB308] text-[25px]" />
                  Status: {opp.status}
                </button>
              </div>

              {message && <div className="mb-4 text-green-500 font-medium">{message}</div>}

              <div>
                <TinaMarkdown
                  content={opp.description}
                  components={{
                    p: (p) => <p className="text-[#C2C2BC] text-[14px]" {...p} />,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interest Form Modal */}
      {showFormModal && (
        <DealFormModal
        opportunity={opp}
        onClose={() => setShowFormModal(false)}
        onSaveChange={onSaveChange}
      />
      )}
      
    </>
  );
}

export default OppModal;
