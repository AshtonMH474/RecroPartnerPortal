import { motion } from "framer-motion"
import { IoMdClose } from "react-icons/io";
import { FaUser } from "react-icons/fa";
function EditProfile({onClose}){
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
            <div className="flex justify-center">
                <div>
                    <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              backgroundColor: "#D9D9D9",
                            }}
                            className="hidden lg:flex justify-center items-center cursor-pointer hover:bg-gray-300"
                          >
                            <FaUser className="text-[30px] font-bold text-black" />
                    </div>
                    <h2 className="font-bold text-[26px]">Edit Profile</h2>
                </div>
                <IoMdClose onClick={onClose} className="cursor-pointer text-white text-[24px] hover:text-primary transition" />
            </div>
        </motion.div>

      </div>
    )
}

export default EditProfile