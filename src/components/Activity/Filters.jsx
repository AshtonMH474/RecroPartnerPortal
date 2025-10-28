import { useState, useRef, useEffect, useCallback } from "react";
import { clear } from "./functions";
import InterestDropdown from "./InterestDropdown";
import DateDropdown from "./DateDropdown";

function Filters({active,setCards,setAllCards,recent, filters, setFormData, categories,onSubmit,formData }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); 
  const handleChange = useCallback((e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
}, [setFormData]);

const toggleInterest = useCallback((category) => {
  setSelectedInterests(prev => {
    const updated = prev.includes(category)
      ? prev.filter(c => c !== category)
      : [...prev, category];
    setFormData(prevData => ({ ...prevData, interests: updated }));
    return updated;
  });
}, [setFormData]);

  // Close dropdown if click happens outside
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

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-4">
      {filters?.map((filter, i) => {
        if (filter.filter === "name")
          return (
            <input
              name={filter.filter}
              onChange={handleChange}
              key={i}
              value={formData.name || ''}
              placeholder={filter.label}
              className="px-4 focus:outline-none placeholder-white capitalize text-white py-2 border primary-border rounded-xl text-white transition-colors duration-300"
            />
          );

         if(filter.filter == 'date') return (
                <DateDropdown 
                key={i} 
                formData={formData} 
                filter={filter} 
                handleChange={handleChange}/> 
            )

        if (filter.filter === "interests")
          return (
            <div key={i} className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="px-4 py-2 border primary-border rounded-xl bg-transparent text-white focus:outline-none"
              >
                Interests {selectedInterests.length > 0 && `(${selectedInterests.length})`}
              </button>
              {open && (
                    <InterestDropdown 
                    categories={categories} 
                    selectedInterests={selectedInterests} 
                    toggleInterest={toggleInterest}/>
              )}
            </div>
          );
      })}
      <button
        onClick={() => {
            clear(active, recent, setCards, setAllCards);
            setFormData({
            name: '',
            interests: [],
            date: ''
            });
            setSelectedInterests([]); 
        }}
        className="bg-primary capitalize cursor-pointer px-8 py-2 w-auto rounded hover:opacity-80 text-white"
        >
        Clear
        </button>
      <button onClick={onSubmit} className="bg-[#1A1A1E] border border-white/15 capitalize cursor-pointer px-8 py-2 w-auto rounded hover:opacity-80 text-white">
        Search
      </button>
    </div>
  );
}

export default Filters;
