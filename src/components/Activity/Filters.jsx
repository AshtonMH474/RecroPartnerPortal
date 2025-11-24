import { useState, useRef, useEffect, useCallback } from "react";
import { clear } from "./functions";
import InterestDropdown from "../utils/InterestDropdown";
import DateDropdown from "../utils/DateDropdown";
import { tinaField } from "tinacms/dist/react";

function Filters({active,setCards,setAllCards,recent, filters, setFormData, categories,onSubmit,formData }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [open, setOpen] = useState(false);
  const [localName, setLocalName] = useState(formData.name || '');
  const dropdownRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // ✅ Sync local state when formData.name changes externally (e.g., clear button)
  useEffect(() => {
    setLocalName(formData.name || '');
  }, [formData.name]);

  // ✅ Debounced update to formData when user types
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (localName !== formData.name) {
        setFormData(prev => ({
          ...prev,
          name: localName,
        }));
      }
    }, 300); // 300ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localName, formData.name, setFormData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // For name field, update local state immediately (visual feedback)
    if (name === 'name') {
      setLocalName(value);
      return;
    }

    // For other fields, update formData immediately
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, [setFormData]);

const toggleInterest = useCallback((category) => {
  setSelectedInterests(prev => {
    const updated = prev.includes(category)
      ? prev.filter(c => c !== category)
      : [...prev, category];
    
    return updated;
  });
  setFormData(prevData => ({ ...prevData, interests: selectedInterests }));
}, [setFormData, selectedInterests]);

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
    <div className="flex flex-wrap items-start gap-x-4 gap-y-4">
      {filters?.map((filter, i) => {
        if (filter.filter === "name")
          return (
            <input data-tina-field={tinaField(filter,'label')}
              name={filter.filter}
              onChange={handleChange}
              key={i}
              value={localName}
              placeholder={filter.label}
              className="text-[14px] md:text-[16px] px-3 w-[150px] md:w-auto md:px-4  focus:outline-none placeholder-white capitalize text-white py-1 md:py-2 border primary-border rounded-xl text-white transition-colors duration-300"
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
            <div data-tina-field={tinaField(filter,'label')} key={i} className="relative text-[14px] md:text-[16px]" ref={dropdownRef}>
              <div
                                        type="button"
                                        onClick={() => setOpen(!open)}
                                        className="capitalize px-3 md:px-4 py-1 md:py-2 text-[14px] md:text-[16px] border primary-border rounded-xl bg-transparent text-white focus:outline-none flex items-center gap-x-3 md:gap-x-8  w-full"
                                        aria-expanded={open}
                                        aria-haspopup="true"
                                    >
                                            <span>{filter.label} {selectedInterests.length > 0 && `(${selectedInterests.length})`}</span>
                                            <svg 
                                                className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
              </div>
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
        className="bg-primary text-[14px] md:text-[16px] capitalize cursor-pointer px-6 md:px-8 py-1 md:py-2 w-auto rounded hover:opacity-80 text-white"
        >
        Clear
        </button>
      <button onClick={onSubmit} className="text-[14px] md:text-[16px] bg-[#1A1A1E] border border-white/15 capitalize cursor-pointer px-6 md:px-8 py-1 md:py-2 w-auto rounded hover:opacity-80 text-white">
        Search
      </button>
    </div>
  );
}

export default Filters;
