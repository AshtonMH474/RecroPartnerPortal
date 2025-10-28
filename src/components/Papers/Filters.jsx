import { useCallback, useEffect, useRef, useState } from "react";
import DateDropdown from "../Activity/DateDropdown";
import InterestDropdown from "../Activity/InterestDropdown";
import { tinaField } from "tinacms/dist/react";
import StateDropdown from "../AllOpps.jsx/StateDropdown";

function Filters({allCards,setCards,setFormData,categories,formData, filters,onSubmit}){
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
      <div>
              <div className="flex flex-wrap gap-x-4 gap-y-4">
                {filters?.map((filter, i) => {
                      if (filter.filter === "name")
                          return (
                        <div data-tina-field={tinaField(filter,'label')}>
                              <input
                              
                              name={filter.filter}
                              onChange={handleChange}
                              key={i}
                              value={formData.name || ''}
                              placeholder={filter.label}
                              className="px-4  focus:outline-none placeholder-white capitalize text-white py-2 border primary-border rounded-xl text-white transition-colors duration-300"
                              />
                          </div>
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
                              <div data-tina-field={tinaField(filter,'label')} key={i} className="relative" ref={dropdownRef}>
                              <div
                                  
                                  onClick={() => setOpen(!open)}
                                  className="self-start flex px-8  py-2 border primary-border rounded-xl bg-transparent text-white focus:outline-none"
                              >
                                  {filter.label} {selectedInterests.length > 0 && `(${selectedInterests.length})`}
                              </div>
                              {open && (
                                      <InterestDropdown 
                                      categories={categories} 
                                      selectedInterests={selectedInterests} 
                                      toggleInterest={toggleInterest}/>
                              )}
                              </div>
                          );
                        if(filter.filter == 'agency')
                          return(
                        
                              <input
                              data-tina-field={tinaField(filter,'label')}
                              name={filter.filter}
                              onChange={handleChange}
                              key={i}
                              value={formData.agency || ''}
                              placeholder={filter.label}
                              className="px-4 focus:outline-none placeholder-white capitalize text-white py-2 border primary-border rounded-xl text-white transition-colors duration-300"
                              />
                          );

                        if(filter.filter == 'type')
                          return(
                              <input
                              data-tina-field={tinaField(filter,'label')}
                              name={filter.filter}
                              onChange={handleChange}
                              key={i}
                              value={formData.type || ''}
                              placeholder={filter.label}
                              className="px-4 focus:outline-none placeholder-white capitalize text-white py-2 border primary-border rounded-xl text-white transition-colors duration-300"
                              />
                        )
                        if(filter.filter == 'state') {
                          return <StateDropdown key={i} handleChange={handleChange} filter={filter} formData={formData}/>
                        }
                        
                  })}

                  <button
                  onClick={() => {
                      setFormData({
                      name: '',
                      interests: [],
                      date: '',
                      agency:'',
                      state:'',
                      type:''
                      });
                      setSelectedInterests([]); 
                      setCards(allCards)
                  }}
                  className="bg-primary capitalize cursor-pointer px-8 py-2 w-auto rounded hover:opacity-80 text-white"
                  >
                      Clear
                  </button>
                  <button onClick={onSubmit}  className="bg-[#1A1A1E] border border-white/15 capitalize cursor-pointer px-8 py-2 w-auto rounded hover:opacity-80 text-white">
                      Search
                  </button>
              </div>
        </div>
    )

}

export default Filters
