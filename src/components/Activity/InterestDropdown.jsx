import React from "react";

const InterestDropdown = React.memo(({ categories, selectedInterests, toggleInterest }) => (
  <div className="absolute mt-2 bg-[#1A1A1E] border border-white/15 rounded-xl min-w-[250px] z-10">
    {categories?.map((cat, j) => (
      <div key={j} className="flex items-center justify-between px-4 py-2 hover:bg-white/10">
        <span className="capitalize text-white">{cat.category}</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedInterests.includes(cat.category)}
            onChange={() => toggleInterest(cat.category)}
            className="sr-only peer"
          />
          <div className="w-10 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#B55914] transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-4 transition-transform"></div>
        </label>
      </div>
    ))}
  </div>
));


export default InterestDropdown