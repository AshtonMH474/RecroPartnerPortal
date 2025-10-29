import Card from "./Card"

function Cards({cardOptions,cards,props}){
    
    return (
        <div className="flex flex-wrap justify-center  gap-x-12 px-4 gap-y-8 pt-8 pb-10">
            {cards?.map((card,i) => (
                <Card cardOptions={cardOptions} card={card} props={props} key={i}/>
            ))}
        </div>
    )
}
export default Cards