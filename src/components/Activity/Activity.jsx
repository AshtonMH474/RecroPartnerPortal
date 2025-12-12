import { useEffect, useState, useMemo, useCallback } from "react"

import { TabFilter, SearchFilter, Heading } from "@/components/shared"
import { useAuth } from "@/context/auth"
import { useDownloads } from "@/context/downloads"
import Cards from "../Cards/Cards"
import Pagination from "../utils/Pagination"
import { motion, AnimatePresence } from "framer-motion";
import { getCategories } from "@/lib/service_functions"
import { clear } from "./functions"
import { tinaField } from "tinacms/dist/react"

function Activity({props}){

    const {user} = useAuth()
    const { downloads } = useDownloads()
    const [active, setActive] = useState(props?.type?.[0]?.filter || '');
    const [cards,setCards] = useState([])
    const [allCards, setAllCards] = useState([]);
    const [categories,setCategories] = useState([])
    const [startIndex, setStartIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [activeLink,setLink] = useState('')
    const [formData,setFormData] = useState({
        name:'',
        interests:[],
        date:''
    })
    const visibleCount = 8
    const totalPages = Math.ceil(cards.length / visibleCount);

    const goToPage = (pageIndex) => {
        const newStartIndex = pageIndex * visibleCount;
        const goingForward = pageIndex > startIndex / visibleCount;

        setDirection(goingForward ? 1 : -1);
        setStartIndex(newStartIndex);

    };

    useEffect(() =>{
        if(active == 'sheets'){
            setLink('/sheets')
        }
        else if(active == 'statements'){
            setLink('/statements')
        }
        else setLink('/papers')
    },[active])

    useEffect(() => {
        clear(active,downloads,setCards,setAllCards)
    },[user,active,downloads])

    const visibleCards = cards.slice(startIndex, startIndex + visibleCount);
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

    // ✅ Memoize the filtering logic to prevent re-computation on every render
    const filteredCards = useMemo(() => {
        return allCards.filter((card) => {
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
    }, [allCards, formData.interests, formData.name, formData.date]);

    // ✅ Wrap onSubmit in useCallback to prevent recreation on every render
    const onSubmit = useCallback(() => {
        setStartIndex(0)
        setCards(filteredCards);
    }, [filteredCards]);

    
    return(
        <div className="pb-20" style={{minHeight:'100vh'}}>
            <div className="mt-20 px-4 md:px-12">
                <div className="flex flex-wrap items-center gap-x-2 md:gap-x-4">
                    <Heading props={props}/>
                    <TabFilter tabs={props.type || []} active={active} setActive={setActive} />
                </div>
                <div>
                    <SearchFilter
                        filters={props.filters || []}
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={onSubmit}
                        onClear={() => clear(active, downloads, setCards, setAllCards)}
                        categories={categories}
                    />
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
                    className="md:min-h-[1000px]"
                    >
                    <Cards cards={visibleCards} />
    
                    {visibleCards.length == 0  && (
                       <div className="flex flex-col items-center justify-center  text-center text-white/80">
                                    <p className="text-lg mb-6">You don’t have any recent activity yet.</p>
                                    <a
                                    data-tina-field={tinaField(props,'noActivityText')}
                                    href={activeLink}
                                    className="px-6 py-3 bg-[#1A1A1E]   text-white rounded-xl border border-white/10 transition-all duration-300"
                                    >
                                    {props.noActivityText} <span className="capitalize">{active}</span>
                                    </a>
                                </div>)}
                    </motion.div>
                </AnimatePresence>
                
                </div>
                
            </div>
            <Pagination totalPages={totalPages} currentPage={startIndex / visibleCount} goToPage={goToPage}/>
        </div>
    )
}

export default Activity