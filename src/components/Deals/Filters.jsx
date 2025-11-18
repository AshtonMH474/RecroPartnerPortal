import { useCallback, useEffect, useRef, useState } from "react";
import AgenciesDropdown from "./AgenciesDropdown";

function DealFilters({formData,setFormData,onSubmit,setCards,deals}){
    const [selectedAgencies, setSelectedAgencies] = useState([]);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null); 

    const toggleAgency = useCallback((category) => {
    setSelectedAgencies(prev => {
        let updated;
        if (prev.includes(category)) {
            updated = prev.filter(c => c !== category); // remove if exists
        } else {
            updated = [...prev, category]; // add if not exists
        }

        // Update formData simultaneously
        setFormData(fd => ({ ...fd, agencies: updated }));
        return updated;
    });
}, [setFormData]);
    const handleChange = useCallback((e) => {
          
          setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
          
        }, [setFormData]);


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
        <div className="">
            <div className="flex flex-wrap items-start gap-x-4 gap-y-4">
                <input
                    name={'name'}
                    onChange={handleChange}
                    value={formData.name || ''}
                    placeholder={"Name"}
                    className="text-[14px] md:text-[16px] px-2 w-[120px] md:w-auto md:px-4  focus:outline-none placeholder-white capitalize text-white py-1 md:py-2 border primary-border rounded-xl text-white transition-colors duration-300"
                />
                <div  className="relative" ref={dropdownRef}>
                              <div
                                  
                                  onClick={() => setOpen(!open)}
                                  className="self-start flex text-[14px] md:text-[16px] px-4 md:px-8  py-1 md:py-2 border primary-border rounded-xl bg-transparent text-white focus:outline-none"
                              >
                                  Agencies {selectedAgencies.length > 0 && `(${selectedAgencies.length})`}
                              </div>
                              {open && (
                                <AgenciesDropdown selectedAgencies={selectedAgencies} toggleAgency={toggleAgency}/>
                              )}
                    
                </div>
                          <button
                            onClick={() => {
                                setFormData({
                                name: '',
                                agencies: [],
                                });
                                setSelectedAgencies([]); 
                                setCards(deals)
                            }}
                            className="bg-primary text-[14px] md:text-[16px] capitalize cursor-pointer px-6 md:px-8 py-1 md:py-2 w-auto rounded hover:opacity-80 text-white"
                            >
                                Clear
                            </button>
                            <button onClick={onSubmit}  className="text-[14px] md:text-[16px] bg-[#1A1A1E] border border-white/15 capitalize cursor-pointer px-6 md:px-8 py-1 md:py-2 w-auto rounded hover:opacity-80 text-white">
                                Search
                            </button>
            </div>
        </div>
    )
}

export default DealFilters