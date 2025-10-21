import IconRenderer from "../utils/IconRenderer";

function EditCategories({categories,activeCategories,toggleCategory}){
    return(
        <div className="flex justify-center flex-wrap gap-x-4 pt-4 gap-y-2">
                                {categories?.map((cat,i) => {
                                    const isActive = activeCategories.includes(cat._sys.filename);
                                    if(isActive) return <div onClick={() => toggleCategory(cat._sys.filename)} className="transition duration-300 cursor-pointer flex font-bold  justify-center items-center gap-x-2 capitalize rounded-full border border-white/15 w-auto px-4 py-6 h-10 text-[18px] bg-primary" key={i}><IconRenderer size={'30px'} iconName={cat.icon}/>{cat.category}</div>
                                    else return <div onClick={() => toggleCategory(cat._sys.filename)} className="transition duration-300 cursor-pointer flex font-bold  justify-center items-center gap-x-2 capitalize rounded-full border border-white/15 w-auto px-4 py-6 h-10 text-[18px] bg-[#1A1A1E]" key={i}><IconRenderer size={'30px'} iconName={cat.icon}/>{cat.category}</div>
                                })}
        </div>
    )
}

export default EditCategories