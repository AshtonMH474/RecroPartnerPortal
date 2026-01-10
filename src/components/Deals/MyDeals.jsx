import { useEffect, useState } from "react";
import Filters from "./Filters";
import { Heading } from "@/components/shared";
import { useAuth } from "@/context/auth";
import { fetchPartnerTickets,getMyDeals } from "@/lib/service_functions";
import { AnimatePresence,motion } from "framer-motion";
import Tickets from "../Tickets/Tickets";
import Pagination from "../utils/Pagination";
import Deals from "./Deals";
import DealFormModal from "../DealForm";
import { tinaField } from "tinacms/dist/react";
import { pageSlideVariants } from "@/lib/animations";


function MyDeals({props}){
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
    useEffect(() => {
  async function fetchDeals() {
    try {
      if (!user?.hubspotID) return; // wait until user is loaded
      const data = await getMyDeals(); // ✅ await the Promise
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
      const data = await fetchPartnerTickets(); // ✅ await the Promise
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
            <div className="pb-20 px-4" style={{minHeight:props?.background == 'black' ? '' : '100dvh',background:props?.background == 'black' ? 'black' : ''}}>
                <div className="mt-20 xl:mt-40 max-w-[1400px] mx-auto" style={{paddingTop:props?.background == 'black' ? '50px':''}}>
                    <div className="flex justify-center flex-col items-center">
                        <Heading props={props}/>
                        <div className="">
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
                    variants={pageSlideVariants}
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
                 
                <div className="flex  flex-col items-center ">
                    {!visibleCards.length && (<p data-tina-field={tinaField(props,'noDealsText')} className=" text-md md:text-lg text-center text-[#C2C2BC] mb-6">{props.noDealsText}</p>)}
                    <button
                    onClick={() => setShowFormModal(true)}
                    data-tina-field={tinaField(props,'registerLabel')}
                    className="bg-primary text-[18px] capitalize cursor-pointer px-8 py-2 w-auto rounded hover:opacity-80 text-white"
                    >
                        {props.registerLabel}
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


export default MyDeals;