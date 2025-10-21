import { motion } from "framer-motion"
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

        </motion.div>

      </div>
    )
}

export default EditProfile