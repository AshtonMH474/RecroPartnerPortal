import { useEffect, useState } from "react"
import Filters from "../Dashboard/Filters"
import Heading from "./Heading"
import Buttons from "./Buttons"
import Cards from "./Cards/Cards"
import { useAuth } from "@/context/auth"

function Opportunites({props,opportunites}){
    const [active,setActive] = useState(props?.filters[0].filter || '')
    const [cards,setCards] = useState([])
    const {user,openModal} = useAuth()
    const [yourOpps,setYourOpps] = useState([])
    

    useEffect(() => {
    // only run once user is loaded
    if(user == 'loading') return
    if (user && (!user.interests || user.interests.length === 0)) {
      openModal("Edit");
    }
  }, [user]);

    if(!opportunites) return null


    
   
    useEffect(() => {
        async function fetchYourOpps() {
            try {
            if (!user?.email) return; // don't run until user is ready
            const res = await fetch(`/api/userInfo/getOpps?email=${encodeURIComponent(user.email)}`);
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            const data = await res.json();
            setYourOpps(data.opps || []);
            } catch (err) {
            console.error("Failed to fetch user's opportunities:", err);
            }
        }
        fetchYourOpps();
    }, [user]); // ✅ only refetch when user changes


    useEffect(() => {
        if (!user || !opportunites?.length) return;

        let newOpps = [...opportunites].sort((a, b) => {
            const dateA = new Date(a?.lastUpdated);
            const dateB = new Date(b?.lastUpdated);
            return dateB - dateA;
        });

         const yourOppIds = new Set(yourOpps.map(o => o._sys.filename));
        

        const merged = newOpps.map(card => ({
            ...card,
            saved: yourOppIds.has(card._sys.filename),
        }));

        if (active === "new") {
            setCards(merged.slice(0, 6));
            return;
        }

        const userInterests = user?.interests || [];
        const filtered = merged
            .filter(o => userInterests.includes(o.category._sys.filename))
            .slice(0, 6);

       

        setCards(filtered);
        }, [active, user, yourOpps, opportunites]);
        


 
    return(
        <div className="bg-black pb-20">
            <div className="pt-20 pl-16">
                <div className="pr-16">
                    
                    <div className="flex flex-col items-center justify-center">
                        <Heading props={props}/>
                        <Filters props={props} setActive={setActive} active={active}/>
                    </div>
                    
                    
                    <Cards cards={cards} props={props} />
                </div>
                <Buttons buttons={props?.buttons}/>
            </div>
        </div>
    )
}

export default Opportunites