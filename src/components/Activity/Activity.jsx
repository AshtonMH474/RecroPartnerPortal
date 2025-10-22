import { useEffect, useState } from "react"
import Heading from "./Heading"
import Types from "./Types"
import { useAuth } from "@/context/auth"
import Cards from "../Dashboard/Cards/Cards"

function Activity({props}){
    const {user} = useAuth()
    const [active,setActive] = useState(props.type[0].filter)
    const [recent,setRecent] = useState([])
    const [cards,setCards] = useState([])


    useEffect(() => {
            async function getDownloads() {
                try {
                if (!user?.email) return; // don't run until user is ready
    
                const res = await fetch(`/api/userInfo/downloads?email=${encodeURIComponent(user.email)}`);
                if (!res.ok) throw new Error(`Error: ${res.status}`);
    
                const data = await res.json();
                 const downloads = data.downloads
                .sort((a, b) => {
                const dateA = new Date(a.lastUpdated);
                const dateB = new Date(b.lastUpdated);
                return dateB - dateA; // most recent first
            })
                setRecent(downloads)
               
                
                } catch (err) {
                console.error("Failed to fetch downloads:", err);
                }
            }
    
            getDownloads();
            
    }, [user?.email]); 

    useEffect(() => {
        let filtered;
        if(active == 'sheets'){
             filtered = recent?.filter((rec) => rec.__typename == 'Sheet')
        }else{
              filtered = recent?.filter((rec) => rec.__typename == 'Paper')
        }
        setCards(filtered)
    },[user,active,recent])

    return(
        <div className="pb-20" style={{minHeight:'100vh'}}>
            <div className="mt-20  pl-16 ">
                <div className="flex items-center gap-x-4">
                    <Heading props={props}/>
                    <Types types={props.type} active={active} setActive={setActive}/>
                </div>
                <Cards cards={cards}/>
            </div>
            
        </div>
    )
}

export default Activity