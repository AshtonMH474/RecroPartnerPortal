import { act, useEffect, useState } from "react"
import Heading from "./Heading"
import Types from "./Types"
import { useAuth } from "@/context/auth"
import Cards from "../Dashboard/Cards/Cards"
import Pagination from "../Pagination"
import { motion, AnimatePresence } from "framer-motion";
import Filters from "./Filters"
import { getCategories } from "@/lib/auth_functions"
import { clear } from "./functions"
import { set } from "react-hook-form"
import { tinaField } from "tinacms/dist/react"

function Activity({props}){
    const {user} = useAuth()
    const [active,setActive] = useState(props.type[0].filter)
    const [recent,setRecent] = useState([])
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
        }else setLink('/papers')
    },[active])

    useEffect(() => {
            async function getDownloads() {
                try {
                if (!user?.email) return; // don't run until user is ready
    
                const res = await fetch(`/api/userInfo/downloads?email=${encodeURIComponent(user.email)}`);
                if (!res.ok) throw new Error(`Error: ${res.status}`);
    
                const data = await res.json();
                 const downloads = data.downloads
                
        
                setRecent(downloads)
               
                
                } catch (err) {
                console.error("Failed to fetch downloads:", err);
                }
            }
    
            getDownloads();
            
    }, [user?.email]); 
    
    useEffect(() => {
        clear(active,recent,setCards,setAllCards)
    },[user,active,recent])

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
                    <Types types={props.type} active={active} setActive={setActive} formData={formData}/>
                </div>
                <div>
                    <Filters setFormData={setFormData} categories={categories} formData={formData} filters={props.filters} onSubmit={onSubmit} active={active} setCards={setCards} recent={recent} setAllCards={setAllCards}/>
                    
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
                    className="min-h-[1000px]"
                    >
                    <Cards cards={visibleCards} />
                    {visibleCards.length == 0 && (
                       <div className="flex flex-col items-center justify-center py-20 text-center text-white/80">
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