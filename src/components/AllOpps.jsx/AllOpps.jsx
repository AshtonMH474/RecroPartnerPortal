import { useState } from "react"

import Cards from "../Opportunites/Cards/Cards"
import Heading from "../Opportunites/Heading"
import Pagination from "../Pagination";
import { AnimatePresence,motion } from "framer-motion";

function AllOpps({props,opps}){
    console.log(opps)
    const [direction, setDirection] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
     const [cards,setCards] = useState(opps)


    const visibleCount = 6
    const totalPages = Math.ceil(cards.length / visibleCount);
    const visibleCards = cards.slice(startIndex, startIndex + visibleCount);
    const goToPage = (pageIndex) => {
        const newStartIndex = pageIndex * visibleCount;
        const goingForward = pageIndex > startIndex / visibleCount;
        
        setDirection(goingForward ? 1 : -1);
        setStartIndex(newStartIndex);
        
    };

     const variants = {
            enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            }),
            center: { x: 0, opacity: 1 },
            exit: (direction) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            }),
    };

    return(
        <div className="pb-20" style={{minHeight:'100vh'}}>
            <div className="mt-20  flex flex-col items-center pl-16">
                <div>
                    <Heading props={props} />
                </div>
               <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                        key={startIndex} // triggers animation on page change
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        
                        >
                        <Cards cards={visibleCards} props={props}/>
                        </motion.div>
                    </AnimatePresence>
                    
            </div>
            <Pagination totalPages={totalPages} currentPage={startIndex / visibleCount} goToPage={goToPage}/>
        </div>
    )
}


export default AllOpps