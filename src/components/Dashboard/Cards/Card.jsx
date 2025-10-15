import IconRenderer from "@/components/utils/IconRenderer"
import { TinaMarkdown } from "tinacms/dist/rich-text"


function Card({card}){
    return(
        <div className="bg-[#1A1A1E] rounded-xl h-[100px] w-[95%] border border-white/15 overflow-hidden">
            <div className="flex justify-between">
                 <div className="flex pl-4 pt-4">
                    <div className="w-[60px] h-[60px] bg-primary rounded-lg flex justify-center items-center">
                        <IconRenderer size={'42px'} color={'#FAF3E0'} iconName={card.category.icon}/>
                    </div>
                        <div className="pl-4 w-[80%] relative bottom-2">
                            <h2 className="font-bold text-[22px]">{card.title}</h2>
                            <div>
                                <TinaMarkdown
                                content={card.description}
                                components={{
                                    p:(p)=> <p className="text-[#C2C2BC] text-[12px]" {...p}/>
                                }}
                                />
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Card