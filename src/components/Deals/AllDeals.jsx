import Heading from "../Opportunites/Heading";
import { useEffect, useState } from "react";
import { getAllDeals } from "@/lib/auth_functions";
import { useAuth } from "@/context/auth";
import { AnimatePresence,motion } from "framer-motion";
import Pagination from "../Pagination";
import Deals from "./Deals";
import DealFilters from "./Filters";
function AllDeals({props}){
    const {user} = useAuth()
    const [deals,setDeals] = useState([])
    const [cards,setCards] = useState([])
    const [formData,setFormData] = useState({
            name:'',
            agencies:[]
    })
    const [direction, setDirection] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 15
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
    useEffect(() => {
        if(!user?.hubspotID) return
        async function fetchDeals() {
            const data = await getAllDeals(user.email)
            setDeals(data.deals)
            setCards(data.deals)
        }
        fetchDeals()
    }, [user])



    function onSubmit() {
        
        const filteredCards = deals.filter((deal) => {
        const matchesName = formData.name.trim().length === 0 || 
        deal.name.toLowerCase().includes(formData.name.toLowerCase());

        
        const matchesAgency =
        formData.agencies.length === 0 ||
        formData.agencies.some(
            (a) => deal.agency?.toLowerCase().includes(a.toLowerCase())
        );
        
        return matchesName && matchesAgency;
        });
        setCards(filteredCards);
}

    
    return(
        <div className="pb-20" style={{minHeight:'100dvh'}}>
            <div className="mt-20 xl:mt-40 max-w-[1400px] mx-auto">
                <div className="flex flex-col pl-16">
                    <Heading props={props}/>
                    <DealFilters setCards={setCards} deals={deals} onSubmit={onSubmit} setFormData={setFormData} formData={formData} />
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