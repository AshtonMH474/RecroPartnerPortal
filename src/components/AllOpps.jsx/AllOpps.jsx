import { useEffect, useState } from "react"

import Cards from "../Opportunites/Cards/Cards"
import Heading from "../Opportunites/Heading"
import Pagination from "../Pagination";
import { AnimatePresence,motion } from "framer-motion";
import Filters from "../Papers/Filters";
import { getCategories } from "@/lib/auth_functions";

function AllOpps({props,opps}){
 
    const [direction, setDirection] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const allCards = opps
     const [cards,setCards] = useState(opps)
     const [categories,setCategories] = useState([])
     const [formData,setFormData] = useState({
            name:'',
            interests:[],
            date:'',
            state:'',
            agency:'',
            type:''

    })

    function onSubmit() {
        const filteredCards = allCards.filter((card) => {
        const cardDate = new Date(card.lastUpdated);
        const now = new Date();

        // ---- Match by interests ----
        const matchesInterest =
        formData.interests.length === 0 ||
        formData.interests.some(
            (interest) => card.category.category === interest
        );
        // ---- Match by name ----
        const matchesName =
        formData.name.trim().length === 0 ||
        card.title.toLowerCase().includes(formData.name.toLowerCase());

        const matchesAgency =
        formData.agency.trim().length === 0 ||
        card.agency.toLowerCase().includes(formData.agency.toLowerCase());

        const matchesType =
        formData.type.trim().length === 0 ||
        card.type.toLowerCase().includes(formData.type.toLowerCase());

        // ---- Match by date ----
        let matchesDate = true; // default (show all)
        if (formData.date && formData.date.length > 0 && formData.date !== "all") {
        if (formData.date === "month") {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
            matchesDate = cardDate >= oneMonthAgo;
        } else if (formData.date === "year") {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            matchesDate = cardDate >= oneYearAgo;
        }
        }


        let matchesStatus = true;
        if (formData.state) {
        matchesStatus = card.status === formData.state;
        }

        // ---- Must satisfy all filters ----
        return matchesInterest && matchesName && matchesDate && matchesStatus && matchesAgency && matchesType;
    });

    setCards(filteredCards);
}


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


    useEffect(() =>{
        getCategories(setCategories)
    },[])


    return(
        <div className="pb-20" style={{minHeight:'100dvh'}}>
            <div className="mt-20 xl:mt-40  flex flex-col items-center justify-center pl-16">
                <div className="mx-auto ">
                    <div className="pl-14 max-w-[900px]">
                            <div className="flex flex-col">
                                <Heading props={props} />
                            </div>
                            <div>
                                <Filters  allCards={allCards} setCards={setCards} onSubmit={onSubmit} categories={categories} setFormData={setFormData} formData={formData} filters={props.filters}/>
                            </div>
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
                            className="max-w-[1400px]"
                            >
                            <Cards cards={visibleCards} props={props}/>
                            </motion.div>
                        </AnimatePresence>
                </div>
            </div>
            <Pagination totalPages={totalPages} currentPage={startIndex / visibleCount} goToPage={goToPage}/>
        </div>
    )
}


export default AllOpps