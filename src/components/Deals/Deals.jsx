import React from "react"
import Card from "./Card"

const Deals = React.memo(function Deals({cards}){

 return (
        <div className="flex flex-wrap justify-center  pl-10 gap-x-12 px-4 gap-y-8 pt-8 pb-10">
            {cards?.map((card) => (
                <Card  card={card}  key={card.id}/>
            ))}
        </div>
    )
})

export default Deals