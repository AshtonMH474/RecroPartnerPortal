import { tinaField } from "tinacms/dist/react"
import IconRenderer from "../utils/IconRenderer"

function Types({types,active,setActive}){
    
    return(
        <div className="flex flex-wrap gap-x-4 gap-y-4 pb-4">
                    {types?.map((type,i) => {
                            if(type.filter == active){
                                return <button data-tina-field={tinaField(type,'label')} onClick={() => setActive(type.filter)} key={i} className="text=[16px] lg:text-[22px] px-6 h-12 lg:h-15 rounded-full border border-white/15 bg-primary cursor-pointer transition-colors duration-300 ease-in-out flex items-center justify-center gap-x-2"><IconRenderer size={'22px'} color={'#FFFFFF'} iconName={type.icon}/><span className="pt-1">{type.label}</span></button>
                            }
                            return(
                            <button onClick={() => setActive(type.filter)} data-tina-field={tinaField(type,'label')}  className=" text-[16px] lg:text-[22px] px-6 h-12 lg:h-15 rounded-full bg-[#1A1A1E] border border-white/15 cursor-pointer transition-colors duration-300 ease-in-out flex items-center justify-center gap-x-2" key={i}>
                                <IconRenderer size={'22px'} color={'#FFFFFF'} iconName={type.icon}/><span className="pt-1">{type.label}</span>
                            </button>)
                    })}
        </div>
    )
}


export default Types