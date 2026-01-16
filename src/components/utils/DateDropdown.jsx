import { useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

export default function DateDropdown({ filter, handleChange, formData }) {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const options = [
    { label: '1 Month', value: 'month' },
    { label: '1 Year', value: 'year' },
    { label: 'All', value: 'all' },
  ];

  // Find the selected option's label
  const selectedOption = options.find((opt) => opt.value === formData.date);
  const displayText = selectedOption ? selectedOption.label : filter.label;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleOptionClick = (value) => {
    handleChange({ target: { name: filter.filter, value: value } });
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      data-testid="filter-date"
      className="relative"
      data-tina-field={tinaField(filter, 'label')}
    >
      <div
        type="button"
        data-testid="filter-date-toggle"
        onClick={() => setOpen(!open)}
        className="capitalize px-3 md:px-4 py-1 md:py-2 text-[14px] md:text-[16px] border primary-border rounded-xl bg-transparent text-white focus:outline-none flex items-center md:gap-x-8 gap-x-3 w-full"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span data-testid="filter-date-value">{displayText}</span>
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
        <div
          data-testid="filter-date-options"
          className="absolute top-full left-0 mt-2 bg-[#1A1A1E] border border-white/15 rounded-xl md:min-w-[250px] min-w-[110px]  z-10 shadow-lg"
        >
          {options.map((opt, i) => (
            <div
              key={i}
              data-testid={`filter-date-option-${opt.value}`}
              className="flex items-center justify-between px-2 md:px-4 py-2 hover:bg-white/10 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
              onClick={() => handleOptionClick(opt.value)}
            >
              <span className="capitalize text-white">{opt.label}</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={filter.filter}
                  checked={formData.date === opt.value}
                  onChange={() => handleOptionClick(opt.value)}
                  className="sr-only peer"
                />
                <div
                  className={`hidden md:block w-10 h-6 rounded-full transition-colors ${
                    formData.date === opt.value ? 'bg-[#B55914]' : 'bg-gray-500'
                  }`}
                ></div>
                <div
                  className={`hidden md:block absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    formData.date === opt.value ? 'translate-x-4' : 'translate-x-0'
                  }`}
                ></div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
