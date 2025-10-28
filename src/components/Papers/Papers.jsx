import { useEffect, useState } from "react"
import Heading from "../Activity/Heading"
import { AnimatePresence,motion } from "framer-motion"
import Pagination from "../Pagination";
import Cards from "../Dashboard/Cards/Cards";
import { getCategories } from "@/lib/auth_functions";
import Filters from "./Filters";

function Papers({props,papers}){
    const [direction, setDirection] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [cards,setCards] = useState(papers)
    const allCards = papers
    const [categories,setCategories] = useState([])
    const [formData,setFormData] = useState({
            name:'',
            interests:[],
            date:''
    })

    const visibleCount = 8
    const totalPages = Math.ceil(cards.length / visibleCount);
    const visibleCards = cards.slice(startIndex, startIndex + visibleCount);
    const goToPage = (pageIndex) => {
        const newStartIndex = pageIndex * visibleCount;
        const goingForward = pageIndex > startIndex / visibleCount;
        
        setDirection(goingForward ? 1 : -1);
        setStartIndex(newStartIndex);
        
    };


    useEffect(() =>{
            getCategories(setCategories)
    },[])

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

        // ---- Must satisfy all filters ----
        return matchesInterest && matchesName && matchesDate;
    });

    setCards(filteredCards);
}
    return(
        <div className="pb-20" style={{minHeight:'100vh'}}>
             <div className="mt-20  pl-16 ">
                    <div className="flex items-center gap-x-4">
                        <Heading props={props}/>
                    </div>
                    <div>
                        <Filters allCards={allCards} setCards={setCards} setFormData={setFormData} categories={categories} formData={formData} filters={props.filters}  onSubmit={onSubmit}/>
                    </div>
                    <div className="">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                        key={startIndex} // triggers animation on page change
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="min-h-[1075px]"
                        >
                        <Cards cards={visibleCards} />
                        </motion.div>
                    </AnimatePresence>
                    
                    </div>
             </div>
             <Pagination totalPages={totalPages} currentPage={startIndex / visibleCount} goToPage={goToPage}/>
        </div>
    )
}


export default Papers