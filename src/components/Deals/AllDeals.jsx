import Heading from "../Activity/Heading";
import { useEffect, useState, useMemo, useCallback } from "react";
import { getAllDeals } from "@/lib/service_functions";
import { useAuth } from "@/context/auth";
import { AnimatePresence,motion } from "framer-motion";
import Pagination from "../utils/Pagination";
import Deals from "./Deals";
import DealFilters from "./Filters";
import DealFormModal from "../DealForm";
import { tinaField } from "tinacms/dist/react";

// ✅ Move variants outside component to prevent recreation on every render
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

function AllDeals({props}){
    const {user} = useAuth()
    const [deals,setDeals] = useState([])
    const [cards,setCards] = useState([])
    const [showFormModal, setShowFormModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [formData,setFormData] = useState({
            name:'',
            agencies:[]
    })
    const [direction, setDirection] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 15

    // ✅ Memoize derived values
    const totalPages = useMemo(() => Math.ceil(cards.length / visibleCount), [cards.length]);
    const visibleCards = useMemo(() => cards.slice(startIndex, startIndex + visibleCount), [cards, startIndex]);

    // ✅ Wrap goToPage in useCallback to prevent recreation
    const goToPage = useCallback((pageIndex) => {
        const newStartIndex = pageIndex * visibleCount;
        const goingForward = pageIndex > startIndex / visibleCount;

        setDirection(goingForward ? 1 : -1);
        setStartIndex(newStartIndex);
    }, [startIndex]);

    // ✅ Add loading and error states
    useEffect(() => {
        if(!user?.hubspotID) return

        async function fetchDeals() {
            setLoading(true)
            setError(null)
            try {
                const data = await getAllDeals(user.email)
                setDeals(data.deals || [])
                setCards(data.deals || [])
            } catch (err) {
                console.error("Failed to fetch deals:", err)
                setError(err.message || "Failed to load deals")
                setDeals([])
                setCards([])
            } finally {
                setLoading(false)
            }
        }
        fetchDeals()
    }, [user])

    // ✅ Memoize the filtered cards computation
    const filteredCards = useMemo(() => {
        return deals.filter((deal) => {
            const matchesName = formData.name.trim().length === 0 ||
                deal.name.toLowerCase().includes(formData.name.toLowerCase());

            const matchesAgency =
                formData.agencies.length === 0 ||
                formData.agencies.some(
                    (a) => deal.agency?.toLowerCase().includes(a.toLowerCase())
                );

            return matchesName && matchesAgency;
        });
    }, [deals, formData.name, formData.agencies]);

    // ✅ Wrap onSubmit in useCallback
    const onSubmit = useCallback(() => {
        setStartIndex(0)
        setCards(filteredCards);
    }, [filteredCards]);


    return(
        <div className="pb-20 px-0 md:px-12" style={{minHeight:'100dvh'}}>
            <div className="mt-20  max-w-[1400px] mx-auto">
                <div className="flex flex-col px-6 md:px-14">
                    <Heading props={props}/>
                    <DealFilters setCards={setCards} deals={deals} onSubmit={onSubmit} setFormData={setFormData} formData={formData} />
                </div>
            </div>

            {/* ✅ Loading state */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="text-white text-lg">Loading deals...</div>
                </div>
            )}

            {/* ✅ Error state */}
            {error && !loading && (
                <div className="flex justify-center items-center py-20">
                    {/* <div className="text-red-500 text-lg">Error: {error}</div>
                     */}
                    
                </div>
            )}

            {/* ✅ Deals content - only show when not loading and no error */}
            {!loading && !error && (
                <>
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
                    <div className="flex  flex-col items-center pb-4">
                    {!visibleCards.length && (<p data-tina-field={tinaField(props,'noDealsText')} className="text-md md:text-lg text-center text-[#C2C2BC] mb-6">{props.noDealsText}</p>)}
                        <button
                        onClick={() => setShowFormModal(true)}
                        data-tina-field={tinaField(props,'registerLabel')}
                        className="bg-primary text-[18px] capitalize cursor-pointer px-8 py-2 w-auto rounded hover:opacity-80 text-white"
                        >
                            {props.registerLabel}
                        </button>
                        {showFormModal && (
                            <DealFormModal
                            onClose={() => setShowFormModal(false)}
                            grabTickets={false}
                        />
                        )}
                    </div>
                    <Pagination totalPages={totalPages} currentPage={startIndex / visibleCount} goToPage={goToPage}/>
                </>
            )}
        </div>
    )
}

export default AllDeals