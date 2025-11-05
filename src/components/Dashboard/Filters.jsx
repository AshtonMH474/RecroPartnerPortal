import { tinaField } from "tinacms/dist/react"
import IconRenderer from "../utils/IconRenderer"

function Filters({props,setActive,active,recent}){
    
    let filters = props?.options  || props?.filters || []
    return (
        <div className="flex flex-wrap gap-x-6 gap-y-4 ">
            {filters.map((filter,i) => {
                if(filter.filter == 'recent' && recent?.length == 0) return
                if(filter.filter == active){
                    return <button data-tina-field={tinaField(filter,'label')} onClick={() => setActive(filter.filter)} key={i} className="text=[16px] lg:text-[22px] px-6 h-12 lg:h-15 rounded-full border border-white/15 bg-primary cursor-pointer transition-colors duration-300 ease-in-out flex items-center justify-center gap-x-2"><IconRenderer size={'22px'} color={'#FFFFFF'} iconName={filter.icon}/><span className="pt-1">{filter.label}</span></button>
                }else
                    return(
                <button data-tina-field={tinaField(filter,'label')} onClick={() => setActive(filter.filter)} className=" text-[16px] lg:text-[22px] px-6 h-12 lg:h-15 rounded-full bg-[#1A1A1E] border border-white/15 cursor-pointer transition-colors duration-300 ease-in-out flex items-center justify-center gap-x-2" key={i}>
                    <IconRenderer size={'22px'} color={'#FFFFFF'} iconName={filter.icon}/><span className="pt-1">{filter.label}</span>
                </button>)
            })}
        </div>
    )
}

export default Filters