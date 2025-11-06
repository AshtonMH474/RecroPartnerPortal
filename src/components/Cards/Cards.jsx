import Card from "./Card"

function Cards({cards}){
    
    return (
        <div className=" flex flex-col gap-y-4 pt-8 pb-10">
            {cards?.map((card,i) => (
                <Card card={card} key={i}/>
            ))}
        </div>
    )
}
export default Cards