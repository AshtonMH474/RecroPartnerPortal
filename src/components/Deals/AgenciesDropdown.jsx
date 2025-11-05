function AgenciesDropdown({selectedAgencies,toggleAgency}){
    const agencies = ['CIA','NRO','NGA','NSA','DOD','DISA','NASIC','DIA','DLA','DTRA','Air Force','Army','Navy','Marine Corps','Coast Guard','Space Force','DHS','ICE','FEMA','CISA','Treasury','IRS','DOJ','FBI','DOS','Commerce','NASA','USDA','VA','COCOMs','SOCOM','SDA','ODNI','MDA','GSA','CYBERCOM','OPM',"HHS",'DOE','DOI']
    return(
         <div className="absolute mt-2 bg-[#1A1A1E] border border-white/15 rounded-xl min-w-[250px] z-10 max-h-60 overflow-y-auto">
            {agencies?.map((a, i) => (
                <div key={i} className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-white/10">
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