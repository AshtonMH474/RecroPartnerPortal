import { motion } from "framer-motion";


function PlusMinusButton({ expanded, setExpanded }) {
  return (
    <div
      className="relative w-5 h-5 md:w-7 md:h-7 pb-[3px]  cursor-pointer flex items-center justify-center"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Horizontal bar */}
      <motion.span
        initial={false}
        animate={{
          rotate: expanded ? -90 : 0,
          opacity: expanded ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="absolute w-full h-[3px] bg-white rounded"
      />
      {/* Vertical bar */}
      <motion.span
        initial={false}
        animate={{
          rotate: expanded ? 0 : 90,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="absolute w-full h-[3px] bg-white rounded"
      />
    </div>
  );
}

export default PlusMinusButton