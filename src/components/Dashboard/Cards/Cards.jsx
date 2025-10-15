import IconRenderer from "@/components/utils/IconRenderer"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import Card from "./Card"

function Cards({cards}){
    console.log(cards)
    return (
        <div className=" flex flex-col gap-y-4 pt-8 pb-20">
            {cards?.map((card,i) => (
                <Card card={card} key={i}/>

            ))}
        </div>
    )
}
export default Cards