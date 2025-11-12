import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

import { postDeal,fetchPartnerTickets } from "@/lib/service_functions";
import { useAuth } from "@/context/auth";

function DealFormModal({  onClose,grabTickets,setTickets }) {
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("");;
  const { user } = useAuth();

      const [value, setValue] = useState("");

  const handleChange = (e) => {
    // Remove any non-numeric characters
    const numericValue = e.target.value.replace(/[^0-9]/g, "");

    // Format with commas
    const formatted = new Intl.NumberFormat("en-US").format(numericValue);

    setValue(formatted);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      subject:e.target.subject.value,
      amount:value,
      description:e.target.description.value,
      agency: e.target.agency.value,
      program: e.target.program.value,
      vehicle: e.target.vehicle.value,
      samLink: e.target.samLink.value,
    };

    const obj = {}

    if(!formData.subject.length || formData.subject.length < 1){
      obj.subject = "Please fill out the subject"
    }

    if(!formData.amount|| formData.amount < 1){
      obj.amount = "Please fill out the amount"
    }


     if(!formData.description.length || formData.description.length < 1){
      obj.description = "Please fill out a description"
    }

    if(obj.amount || obj.description || obj.subject){
      setErrors(obj)
      return
    } 

     try {
          let data = await postDeal(user, formData);
          setMessage(data);
          if(grabTickets){
            fetchTickets()
          }
          
        } catch (e) {
          alert("There was an Error Saving: " + e);
        }
    // You can add form validation or API submission here
  };
  async function fetchTickets() {
      try {
        if (!user?.hubspotID) return; // wait until user is loaded
        const data = await fetchPartnerTickets(user); // ✅ await the Promise
        setTickets(data.tickets || []);
      } catch (err) {
        console.error("Failed to fetch user's deals:", err);
      }
    }
  

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
            className="relative z-[1001] w-[90%] max-w-[1200px] bg-[#1A1A1E] border border-white/10 rounded-xl p-6 shadow-lg"
          >
            {/* Close button */}
            <IoMdClose
              onClick={onClose}
              className="absolute top-4 right-4 text-white text-[24px] cursor-pointer hover:text-primary transition"
            />

            {/* Form content */}
            <h3 className=" flex justify-center text-[26px] font-semibold text-white mb-4">Submit a Deal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full p-3 rounded-lg bg-[#2C2C33] text-white placeholder-white/70 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
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
                  type="text" // must be text so commas can display
                  name="amount"
                  value={value}
                  onChange={handleChange}
                  inputMode="numeric" // shows numeric keyboard on mobile
                  placeholder="Amount"
                  className="w-full sm:w-1/2 p-3 rounded-lg bg-[#2C2C33] text-white placeholder-white/70 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />

              </div>
              <input
                  type="text"
                  name="vehicle"
                  placeholder="Contract Vehicle"
                  className="w-full  p-3 rounded-lg bg-[#2C2C33] text-white placeholder-white/70 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              <input
                type="text"
                name="samLink"
                placeholder="SAM.gov link"
                className="w-full p-3 rounded-lg bg-[#2C2C33] text-white placeholder-white/70 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />

              <textarea
            placeholder="Description"
            name="description"
            rows={4}
            className="w-full p-2 rounded bg-[#2A2A2E] text-white placeholder-white/70 resize-none"
          ></textarea>

              {errors?.error && (
                <div className="text-red-500 font-medium">{errors.error}</div>
              )}
              {errors?.subject && (
                <div className="text-red-500 font-medium">{errors.subject}</div>
              )}
              {errors?.description && (
                <div className="text-red-500 font-medium">{errors.description}</div>
              )}
              {errors?.amount && (
                <div className="text-red-500 font-medium">{errors.amount}</div>
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

export default DealFormModal;

