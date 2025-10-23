import { useState, useRef, useEffect } from "react";
import { clear } from "./functions";

function Filters({active,setCards,setAllCards,recent, filters, setFormData, categories,onSubmit,formData }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); 
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleInterest = (category) => {
    let updated;
    if (selectedInterests.includes(category)) {
      updated = selectedInterests.filter((c) => c !== category);
    } else {
      updated = [...selectedInterests, category];
    }
    setSelectedInterests(updated);
    setFormData((prev) => ({
      ...prev,
      interests: updated,
    }));
    
  };

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
                  <select
                  key={i}
                  name={filter.filter}
                  value={formData.date || ""}
                  onChange={handleChange}
                  className="px-4 py-2 border primary-border rounded-xl bg-transparent 
                            text-white focus:outline-none focus:border-primary capitalize 
                            appearance-none transition-colors duration-300"
                >
                  <option value="" disabled hidden className="bg-[#1A1A1E] text-white">
                    Date
                  </option>
                  <option value="month" className="bg-[#1A1A1E] text-white">
                    1 Month
                  </option>
                  <option value="year" className="bg-[#1A1A1E] text-white">
                    1 Year
                  </option>
                  <option value="all" className="bg-[#1A1A1E] text-white">
                    All
                  </option>
                </select>
               
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
                <div className="absolute mt-1 bg-[#1A1A1E] border primary-border rounded-xl w-[200px] z-10">
                  {categories?.map((cat, j) => (
                    <div
                      key={j}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-white/10"
                      onClick={() => toggleInterest(cat.category)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedInterests.includes(cat.category)}
                        readOnly
                        className="mr-2"
                      />
                      <span className="capitalize text-white">{cat.category}</span>
                    </div>
                  ))}
                </div>
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
            setSelectedInterests([]); // 👈 reset local checkbox state
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
