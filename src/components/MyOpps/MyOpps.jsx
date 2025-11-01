import { useAuth } from "@/context/auth";
import { useEffect, useState } from "react";
import Heading from "../Opportunites/Heading";
import Filters from "../Papers/Filters";
import {  fetchPartnerTickets, getCategories } from "@/lib/auth_functions";
import { AnimatePresence,motion } from "framer-motion";
import Cards from "../Opportunites/Cards/Cards";
import Pagination from "../Pagination";
import DashboardFilters from "../Dashboard/Filters";
import Tickets from "../Tickets/Tickets";


function MyOpps({props}){
    
    const {user} = useAuth()
    const [allCards,setAllCards] = useState([])
    const [loading,setLoading] = useState(false)
    const [cards,setCards] = useState([])
    const [categories,setCategories] = useState([])
    const [tickets,setTickets] = useState([])
    const [formData,setFormData] = useState({
            name:'',
            interests:[],
            date:'',
            state:'',
            agency:'',
            type:''

    })
    const cardOptions = {setAllCards,setCards}
    const [active,setActive] = useState(props?.options[0].filter)
    const [direction, setDirection] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
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
    useEffect(() => {
                async function getOpps() {
                    try {
                    if (!user?.email) return; // don't run until user is ready
        
                    const res = await fetch(`/api/userInfo/getOpps?email=${encodeURIComponent(user.email)}`);
                    if (!res.ok) throw new Error(`Error: ${res.status}`);
        
                    const data = await res.json();
                    
                    setAllCards(data.opps)
                    setCards(data.opps)
                   
                   return 
                    
                    } catch (err) {
                    console.error("Failed to fetch downloads:", err);
                    }
                }
                
                getOpps();
                
                
        }, [user?.email]); 


        useEffect(() => {
    // Only run once user is defined and has hubspotID
    if (!user?.hubspotID) return;

    const getTickets = async () => {
      try {
        setLoading(true);
        const data = await fetchPartnerTickets(user);
        
        setTickets(data.tickets || []);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTickets();
  }, [user]); // ✅ runs again once user updates

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



    return(
        <div className="pb-20" style={{minHeight:'100dvh'}}>
            <div className="mt-20 xl:mt-40 max-w-[1400px] mx-auto pl-16">
                <div className="mx-auto ">
                    <div className="pl-6 max-w-[900px]">
                        <div className="flex  flex-wrap items-center gap-x-4">
                                <Heading props={props} />
                                <div className="pb-4">
                                    <DashboardFilters active={active} setActive={setActive} props={props}/>
                                </div>
                        </div>
                        <div>
                            {active != 'intrested' && cards.length > 0 && cards[0]?._sys?.filename && (<Filters onSubmit={onSubmit} allCards={allCards} setCards={setCards}  categories={categories} setFormData={setFormData} formData={formData} filters={props.filters} />)}
                            
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
                               {active != 'intrested' && cards.length > 0 && cards[0]?._sys?.filename && ( <Cards cardOptions={cardOptions}  cards={visibleCards} props={props}/>)}
                               {active == 'intrested' && (<Tickets cards={tickets}/>)}
                            </motion.div>
                        </AnimatePresence>
                </div>
            </div>
            <Pagination totalPages={totalPages} currentPage={startIndex / visibleCount} goToPage={goToPage}/>
        </div>
    )
}

export default MyOpps