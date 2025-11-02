import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { saveOpp } from "@/lib/auth_functions";
import { useAuth } from "@/context/auth";

function IntrestedFormModal({ opportunity, onClose,onSaveChange }) {
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("");;
    const { user } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
        ...opportunity,
      agency: e.target.agency.value,
      program: e.target.program.value,
      vehicle: e.target.vehicle.value,
      samLink: e.target.samLink.value,
    };
     try {
          let data = await saveOpp(user, formData, true);
          setMessage(data);
          onSaveChange?.(true);
        } catch (e) {
          alert("There was an Error Saving: " + e);
        }
    // You can add form validation or API submission here
  };

  return (
    <AnimatePresence>
      
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

          {/* Modal content */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="relative z-[1001] w-[90%] max-w-[700px] bg-[#1A1A1E] border border-white/10 rounded-xl p-6 shadow-lg"
          >
            {/* Close button */}
            <IoMdClose
              onClick={onClose}
              className="absolute top-4 right-4 text-white text-[24px] cursor-pointer hover:text-primary transition"
            />

            {/* Form content */}
            <h3 className=" flex justify-center text-xl font-semibold text-white mb-4">Express Interest</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="agency"
                placeholder="Agency"
                className="w-full p-3 rounded-lg bg-[#2C2C33] text-white placeholder-white/70 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  name="program"
                  placeholder="Program"
                  className="w-full sm:w-1/2 p-3 rounded-lg bg-[#2C2C33] text-white placeholder-white/70 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
                <input
                  type="text"
                  name="vehicle"
                  placeholder="Vehicle"
                  className="w-full sm:w-1/2 p-3 rounded-lg bg-[#2C2C33] text-white placeholder-white/70 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>

              <input
                type="text"
                name="samLink"
                placeholder="SAM.gov link"
                className="w-full p-3 rounded-lg bg-[#2C2C33] text-white placeholder-white/70 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />

              {errors?.error && (
                <div className="text-red-500 font-medium">{errors.error}</div>
              )}
            {message && <div className="mb-4 text-green-500 font-medium">{message}</div>}
              <div className="flex justify-center">
                  <button
                    type="submit"
                    className="hover:opacity-80 cursor-pointer w-full py-2 rounded bg-primary text-white hover:bg-primary/80 transition"
                >
                        Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
    
    </AnimatePresence>
  );
}

export default IntrestedFormModal;

