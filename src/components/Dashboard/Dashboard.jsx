import { useAuth } from "@/context/auth"
import { useRouter } from "next/router"
import Heading from "./Heading"
import Filters from "./Filters"
import { useEffect, useState } from "react"
import Cards from "./Cards/Cards"
import Buttons from "./Buttons"


function Dashboard({props,papers,sheets}){
    const {user} = useAuth()
    const router = useRouter()
    const [active,setActive] = useState(props?.filters[0].filter || '')
    const [recent,setRecent] = useState([])
    const [buttons,setButtons] = useState(props?.filters[0].buttons || [])
    const [cards,setCards] = useState([])
    
    
    if(!user){
        router.push('/')
        return (
            <div style={{minHeight:'100vh'}}></div>
        )
    }

    useEffect(() => {
    async function  updateValues() {
        if (active === 'papers'){
          await setCards(papers)
        }
        else if (active === 'recent'){
            await setCards(recent)
        }
        else if (active === 'sheets') {
            await setCards(sheets)
        }
        let filter = props?.filters.find((filter) => filter.filter == active)
        await setButtons(filter?.buttons || [])
        
    }

    updateValues()
    
    
    }, [active, recent, papers, sheets])

    useEffect(() => {
        async function getDownloads() {
            try {
            if (!user?.email) return; // don't run until user is ready

            const res = await fetch(`/api/userInfo/downloads?email=${encodeURIComponent(user.email)}`);
            if (!res.ok) throw new Error(`Error: ${res.status}`);

            const data = await res.json();
            setRecent(data.downloads.slice(0,8))
            console.log(data)
            
            } catch (err) {
            console.error("Failed to fetch downloads:", err);
            }
        }

        getDownloads();
    }, [user?.email]); 
    

    return(
        <div style={{minHeight:'100vh'}}>
            <div className="mt-32 flex flex-col pl-16">
                <div>
                   <Heading props={props} user={user} />
                   <Filters recent={recent} active={active} setActive={setActive} props={props} user={user}/>
                </div>
                <Cards cards={cards}/>
                <Buttons buttons={buttons} /> 
            </div>
        </div>
    )
}

export default Dashboard