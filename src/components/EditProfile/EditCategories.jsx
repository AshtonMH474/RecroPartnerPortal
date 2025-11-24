import IconRenderer from "../utils/IconRenderer";
import { useState, useEffect } from "react";

function EditCategories({categories,activeCategories,toggleCategory,user}){
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
        <div className="flex justify-center flex-wrap gap-x-2 md:gap-x-4 pt-4 gap-y-2">
            {categories?.map((cat,i) => {
                const isActive = activeCategories.includes(cat._sys.filename);
                if(isActive) return <div onClick={() => toggleCategory(cat._sys.filename)} className="transition duration-300 cursor-pointer flex font-bold  justify-center items-center gap-x-2 capitalize rounded-full border border-white/15 w-auto px-2 md:px-4 py-2 md:py-6 h-8 md:h-10 text-[14px] md:text-[18px] bg-primary" key={i}><IconRenderer size={isSmallScreen ? '20px' : '30px'} iconName={cat.icon}/>{cat.category}</div>
                else return <div onClick={() => toggleCategory(cat._sys.filename)} className="transition duration-300 cursor-pointer flex font-bold  justify-center items-center gap-x-2 capitalize rounded-full border border-white/15 w-auto px-2 md:px-4 py-2 md:py-6 h-8 md:h-10 text-[14px] md:text-[18px] bg-[#1A1A1E]" key={i}><IconRenderer size={isSmallScreen ? '20px' : '30px'} iconName={cat.icon}/>{cat.category}</div>
            })}
        </div>
    )
}

export default EditCategories