import Heading from "../Opportunites/Heading";
import { useEffect, useState } from "react";
import { getAllDeals } from "@/lib/auth_functions";
import { useAuth } from "@/context/auth";
import { AnimatePresence,motion } from "framer-motion";
import Pagination from "../Pagination";
import Deals from "../Deals/Deals";
function AllDeals({props}){
    const {user} = useAuth()
    const [deals,setDeals] = useState([])
    const [direction, setDirection] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 15
    const totalPages = Math.ceil(deals.length / visibleCount);
    const visibleCards = deals.slice(startIndex, startIndex + visibleCount);
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
    useEffect(() => {
        if(!user?.hubspotID) return
        async function fetchDeals() {
            const data = await getAllDeals(user.email)
            setDeals(data.deals)
        }
        fetchDeals()
    }, [user])

    console.log(deals)
    return(
        <div className="pb-20" style={{minHeight:'100dvh'}}>
            <div className="mt-20 xl:mt-40 max-w-[1400px] mx-auto">
                <div className="flex justify-center flex-col items-center">
                    <Heading props={props}/>
                </div>
            </div>
            <AnimatePresence  mode="wait" custom={direction}>
                    <motion.div
                    key={startIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="max-w-[1400px] mx-auto"
                    >
                        <Deals cards={visibleCards} />
                    </motion.div>
                </AnimatePresence>
                 <Pagination totalPages={totalPages} currentPage={startIndex / visibleCount} goToPage={goToPage}/>
        </div>
    )
}

export default AllDeals