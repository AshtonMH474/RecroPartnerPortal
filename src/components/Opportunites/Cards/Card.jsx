import IconRenderer from "@/components/utils/IconRenderer"
import { useAuth } from "@/context/auth"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"


function Card({card,props}){
 
    const {openModal} = useAuth()
    card.intrested = props.labelIntrested
    return(
        <div className="cursor-pointer border border-white/15 rounded-[8px] bg-[#1A1A1E] w-[400px] h-[360px] px-4 py-6">
            <div className="pl-2">
                <div className="flex gap-x-4">
                    <div data-tina-field={tinaField(card,'category')} className="w-[80px] h-[80px] mb-4 bg-primary rounded-lg flex justify-center items-center">
                        <IconRenderer
                        size={'58px'}
                        color={"#FAF3E0"}
                        iconName={card.category.icon}
                        />
                    </div>
                    <div className="flex flex-col">
                        <h2 data-tina-field={tinaField(card,'title')} className="font-bold text-[28px]">{card.title}</h2>
                        <h3 data-tina-field={tinaField(card,'agency')} className="text-[20px]">{card.agency}</h3>
                    </div>
                </div>
                <div data-tina-field={tinaField(card,'description')} className="gap-y-3  flex flex-col ">
                    <TinaMarkdown content={card.description}
                    components={{
                        p:(p) => <p className="text-[#C2C2BC] text-[14px] truncate-8" {...p} />
                    }} />
                    <div className="flex gap-x-4">
                        <button data-tina-field={tinaField(props,'labelView')} onClick={() => openModal('Opp',card)} className="bg-primary capitalize cursor-pointer text-[18px] px-4 py-2 w-auto rounded hover:opacity-80 text-white">{props.labelView}</button>
                        <button data-tina-field={tinaField(props,'labelIntrested')} className="px-4 capitalize py-2 border text-[18px] primary-border rounded hover:text-white/80 transition-colors duration-300">{props.labelIntrested}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Card