import { useEffect, useState } from "react"
import Filters from "../Dashboard/Filters"
import Heading from "./Heading"
import Buttons from "./Buttons"
import Cards from "./Cards/Cards"

function Opportunites({props,opportunites}){
    const [active,setActive] = useState(props?.filters[0].filter || '')
    const [cards,setCards] = useState([])

    if(!opportunites) return null
    
    useEffect(() => {
        if (active == "new"){
            setCards(opportunites.sort((a,b) => {
                const dateA = new Date(a?.lastUpdated);
                const dateB = new Date(b?.lastUpdated);
                return dateB - dateA;
            }).slice(0,6))
        }else{
            setCards(opportunites)
        }
    },[active])
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