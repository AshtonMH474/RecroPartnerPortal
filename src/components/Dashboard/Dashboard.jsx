import { useAuth } from "@/context/auth"
import { useRouter } from "next/router"
import Heading from "./Heading"
import Filters from "./Filters"
import { useState } from "react"
import Cards from "./Cards/Cards"

function Dashboard({props,papers}){
    const {user} = useAuth()
    const router = useRouter()
    const [active,setActive] = useState(props?.filters[0].filter || '')
    const [cards,setCards] = useState([])
    const allPapers = papers.paperConnection.edges.map(e => e.node);
    
    if(!user){
        router.push('/')
        return (
            <div style={{minHeight:'100vh'}}></div>
        )
    }
    

    return(
        <div style={{minHeight:'100vh'}}>
            <div className="mt-32 flex flex-col pl-16">
                <div>
                   <Heading props={props} user={user} />
                   <Filters active={active} setActive={setActive} props={props} user={user}/>
                </div>
                <Cards cards={allPapers}/>
            </div>
        </div>
    )
}

export default Dashboard