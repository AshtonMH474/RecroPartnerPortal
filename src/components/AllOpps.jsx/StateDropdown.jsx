import { useEffect, useRef, useState } from "react";

export default function StateDropdown({filter,handleChange,formData}){
        const dropdownRef = useRef(null); 
        const [open,setOpen] = useState(false)
        const options = [
        { label: "Open", value: "open" },
        { label: "In Review", value: "In Review" },
        { label: "Closed", value: "closed" },
        ];

        useEffect(() => {
                const handleClickOutside = (event) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setOpen(false);
                  }
                };
                document.addEventListener("mousedown", handleClickOutside);
                return () => {
                  document.removeEventListener("mousedown", handleClickOutside);
                };
        }, []);

        return(
            <div  ref={dropdownRef}>
                {formData.state.length < 1 && (<button
                type="button"
                onClick={() => setOpen(!open)}
                className="capitalize px-8  py-2 border primary-border rounded-xl bg-transparent text-white focus:outline-none">
                    {filter.label}
                </button>)}
                {formData.state.length > 1 && (<button
                type="button"
                onClick={() => setOpen(!open)}
                className="capitalize px-8 py-2 border primary-border rounded-xl bg-transparent text-white focus:outline-none">
                    {formData.state}
                </button>)}
                {open && (
                    <div className="absolute mt-2 bg-[#1A1A1E] border border-white/15 rounded-xl min-w-[250px] z-10">
                        {options.map((opt, i) => (
                            <div
                            key={i}
                            className="cursor-pointer flex items-center justify-between px-4 py-2 hover:bg-white/10"
                            onClick={() => handleChange({ target: { name: filter.filter, value: opt.value } })}
                            >
                            <span className="capitalize text-white">{opt.label}</span>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                type="radio"
                                name={filter.filter}
                                checked={formData.state === opt.value}
                                onChange={() => handleChange({ target: { name: filter.filter, value: opt.value } })}
                                className="sr-only peer"
                                />
                                <div className="w-10 h-6 bg-gray-500 rounded-full peer-checked:bg-[#B55914] transition-colors"></div>
                                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-4 transition-transform"></div>
                            </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
}