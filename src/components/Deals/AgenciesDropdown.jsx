function AgenciesDropdown({selectedAgencies,toggleAgency}){
        const agencies = ['Air Force','Army','CIA','CISA','Coast Guard','COCOMs','Commerce','CYBERCOM','DHS','DIA','DISA','DLA','DOD','DOE','DOI','DOJ','DOS','DTRA','FBI','FEMA','GSA','HHS','ICE','IRS','Marine Corps','MDA','NASA','NASIC','Navy','NGA','NRO','NSA','ODNI','OPM','SDA','SOCOM','Space Force','Treasury','USDA','VA']
        return(
         <div data-testid="filter-agencies-options" className="absolute mt-2 bg-[#1A1A1E] border border-white/15 rounded-xl md:min-w-[250px] min-w-[150px] z-10 max-h-60 overflow-y-auto">
            {agencies?.map((a, i) => (
                <div data-testid={`filter-agency-option-${a.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => toggleAgency(a)} key={i} className="flex cursor-pointer items-center  gap-x-2 justify-between px-2 md:px-4 py-1 md:py-2 hover:bg-white/10">
                <span className="capitalize text-white">{a}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                    type="checkbox"
                    checked={selectedAgencies.includes(a)}
                    onChange={() => toggleAgency(a)}
                    className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#B55914] transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-4 transition-transform"></div>
                </label>
                </div>
            ))}
        </div>

    )
}

export default AgenciesDropdown