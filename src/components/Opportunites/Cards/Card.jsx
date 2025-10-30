import { Check } from "lucide-react";
import IconRenderer from "@/components/utils/IconRenderer"
import { useAuth } from "@/context/auth"
import { deleteOpp, saveOpp } from "@/lib/auth_functions"
import { tinaField } from "tinacms/dist/react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


function Card({cardOptions,card,props}){
    const {setAllCards,setCards} = cardOptions || {};
    const {openModal,user} = useAuth()
     const [checked, setChecked] = useState(card?.saved == true);
    useEffect(() => {
        setChecked(card?.saved == true);
    }, [card]);
    async function save(intrested){
        try{
            await saveOpp(user,card?._sys?.relativePath,intrested)
        }catch(e){
            alert("There was an Error Saving: " + e )
        }
    }

    async function deleteSave() {
        try{
            
            await deleteOpp(user,card?._sys?.relativePath)
            if(setAllCards && setCards){
                await setCards(cards => cards.filter(c => c.id !== card.id));
                await setAllCards(allCards => allCards.filter(c => c.id !== card.id))
                setChecked(true)
            }
        }catch(e){
            alert("There was an Error Saving: " + e )
        }
    }
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
                         <motion.button
                            data-tina-field={tinaField(props,'labelIntrested')}
                            onClick={() => {
                                
                                if(checked == false)save(false)
                                if(checked == true)deleteSave()
                                setChecked(!checked) 
                            }}
                            className={`rounded px-4 py-2 relative flex items-center justify-center   border primary-border transition-all duration-300 
                                ${checked ? "bg-primary " : "border-gray-400"}`}
                            whileTap={{ scale: 0.9 }}
                            >
                            {checked && (
                                <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                >
                                <Check className="text-white w-5 h-5" />
                                </motion.div>
                            )}
                            {!checked && (
                                <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                >
                                    {props.labelSaved}
                                </motion.div>
                            )}
                            </motion.button>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Card