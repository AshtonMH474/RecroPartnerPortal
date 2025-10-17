import { useState } from "react"
import Filters from "../Dashboard/Filters"
import Heading from "./Heading"
import Buttons from "./Buttons"
import Cards from "./Cards/Cards"

function Opportunites({props,opportunites}){
    console.log(opportunites)
    const [active,setActive] = useState(props?.filters[0].filter || '')
    return(
        <div className="bg-black pb-20">
            <div className="pt-20 pl-16">
                <div className="pr-16">
                    
                    <div className="flex flex-col items-center justify-center">
                        <Heading props={props}/>
                        <Filters props={props} setActive={setActive} active={active}/>
                    </div>
                    
                    
                    <Cards cards={opportunites} />
                </div>
                <Buttons buttons={props?.buttons}/>
            </div>
        </div>
    )
}

export default Opportunites