import Card from "./Card";

function Tickets({cards}) {
    return (
        <div className="flex flex-wrap justify-center  gap-x-12 px-4 gap-y-8 pt-8 pb-10">
            {cards?.map((card,i) => (
                <Card  card={card}  key={i}/>
            ))}
        </div>
    )
}

export default Tickets;