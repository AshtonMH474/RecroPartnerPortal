import { tinaField } from "tinacms/dist/react"
import IconRenderer from "../utils/IconRenderer"
import { useState, useEffect } from "react";

function Types({types,active,setActive}){
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    useEffect(() => {
        setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener("resize", () => {
        setIsSmallScreen(window.innerWidth < 768);
        });
        return () => {
        window.removeEventListener("resize", () => {
            setIsSmallScreen(window.innerWidth < 768);
        });
        };
    }, []);
    return(
        <div className="flex flex-wrap gap-x-4 gap-y-4 pb-4">
                    {types?.map((type,i) => {
                            if(type.filter == active){
                                return <button data-tina-field={tinaField(type,'label')} onClick={() => setActive(type.filter)} key={i} className="bg-primary text-[14px] lg:text-[22px] px-4 md:px-6 h-10 md:h-12 lg:h-15 rounded-full border border-white/15 transition-colors duration-300 ease-in-out flex items-center justify-center gap-x-2 cursor-pointer"><IconRenderer size={isSmallScreen ? "14px" : "22px"} color={'#FFFFFF'} iconName={type.icon}/><span className="">{type.label}</span></button>
                            }
                            return(
                            <button onClick={() => setActive(type.filter)} data-tina-field={tinaField(type,'label')}  className="text-[14px] lg:text-[22px] px-4 md:px-6 h-10 md:h-12 lg:h-15 rounded-full border border-white/15 transition-colors duration-300 ease-in-out flex items-center bg-[#1A1A1E] justify-center gap-x-2 cursor-pointer" key={i}>
                                <IconRenderer size={isSmallScreen ? "14px" : "22px"} color={'#FFFFFF'} iconName={type.icon}/><span className="">{type.label}</span>
                            </button>)
                    })}
        </div>
    )
}


export default Types