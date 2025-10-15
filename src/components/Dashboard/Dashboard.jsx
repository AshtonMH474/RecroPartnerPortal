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
    const [cards,setCards] = useState([])
    console.log(props)
    if(!user){
        router.push('/')
        return (
            <div style={{minHeight:'100vh'}}></div>
        )
    }

    useEffect(() => {
        if(active == 'papers'){
            setCards(papers)
        }
        if(active == 'recent'){
            setCards([])
        }
        if(active == 'sheets'){
            setCards(sheets)
        }
    },[active,cards])
    

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