import { useEffect, useState } from "react";
import Filters from "../Dashboard/Filters";
import Heading from "../Opportunites/Heading";
import { useAuth } from "@/context/auth";
import { fetchPartnerTickets, getMyDeals } from "@/lib/auth_functions";
import { AnimatePresence,motion } from "framer-motion";
import Tickets from "../Tickets/Tickets";
import Pagination from "../Pagination";
import Deals from "../Deals/Deals";
import DealFormModal from "../DealForm";


function MyOpportunites({props}){
   
    const {user} = useAuth()
    const [showFormModal, setShowFormModal] = useState(false);
    const [deals,setDeals] = useState([])
    const [tickets,setTickets] = useState([])
    const [cards,setCards] = useState([])
    const [direction, setDirection] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [active, setActive] = useState(props?.options?.[0]?.filter || '');
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
  async function fetchDeals() {
    try {
      if (!user?.hubspotID) return; // wait until user is loaded
      const data = await getMyDeals(user.hubspotID); // ✅ await the Promise
      setDeals(data.deals || []);
    } catch (err) {
      console.error("Failed to fetch user's deals:", err);
    }
  }

  fetchDeals();
}, [user]); // ✅ include `user` as a dependency

    useEffect(() => {
  async function fetchTickets() {
    try {
      if (!user?.hubspotID) return; // wait until user is loaded
      const data = await fetchPartnerTickets(user); // ✅ await the Promise
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Failed to fetch user's deals:", err);
    }
  }

  fetchTickets();
}, [user]); // ✅ include `user` as a dependency

    useEffect(() => {
        if(active == 'deals'){
            setCards(deals)
        }else setCards(tickets)
    },[active,deals,tickets])

    return(
            <div className="pb-20" style={{minHeight:'100dvh'}}>
                <div className="mt-20 xl:mt-40 max-w-[1400px] mx-auto pl-16">
                    <div className="mx-auto ">
                        <Heading props={props}/>
                        <div className="pb-4">
                            <Filters active={active} setActive={setActive} props={props}/>
                        </div>
                    </div>
                    <div>
                       
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
                        {active == 'tickets' && (<Tickets cards={visibleCards} />)}
                        {active == 'deals' && (<Deals cards={visibleCards} />)}
                        
                    </motion.div>
                </AnimatePresence>
                 <Pagination totalPages={totalPages} currentPage={startIndex / visibleCount} goToPage={goToPage}/>
                 
                <div className="flex pt-8 flex-col items-center ">
                    {!visibleCards.length && (<p className="text-lg mb-6">You don’t have any submitted Deals yet.</p>)}
                    <button
                    onClick={() => setShowFormModal(true)}
                    className="transition-colors hover:bg-[#B55914] cursor-pointer px-6 py-3 bg-[#1A1A1E]   text-white rounded-xl border border-white/10 transition-all duration-300"
                    >
                        Reigster a Deal
                    </button>
                </div>
                        
                 {showFormModal && (
                    <DealFormModal
                    onClose={() => setShowFormModal(false)}
                    setTickets={setTickets}
                    grabTickets={true}
                />
                )}
            </div>
    )



}


export default MyOpportunites;