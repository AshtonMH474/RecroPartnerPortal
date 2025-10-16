import { useAuth } from "@/context/auth"
import { useRouter } from "next/router"
import Heading from "./Heading"
import Filters from "./Filters"
import { useEffect, useState } from "react"
import Cards from "./Cards/Cards"

function Dashboard({props,papers,sheets}){
    const {user} = useAuth()
    const router = useRouter()
    const [active,setActive] = useState(props?.filters[0].filter || '')
    const [recent,setRecent] = useState([])
    const [cards,setCards] = useState([])
    
    
    
    if(!user){
        router.push('/')
        return (
            <div style={{minHeight:'100vh'}}></div>
        )
    }

    useEffect(() => {
    if (active === 'papers') setCards(papers)
    else if (active === 'recent') setCards(recent)
    else if (active === 'sheets') setCards(sheets)
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
                   <Filters active={active} setActive={setActive} props={props} user={user}/>
                </div>
                <Cards cards={cards}/>
            </div>
        </div>
    )
}

export default Dashboard