import { useState, useRef, useEffect, useCallback } from "react";
import { tinaField } from "tinacms/dist/react";
import InterestDropdown from "@/components/utils/InterestDropdown";
import DateDropdown from "@/components/utils/DateDropdown";

/**
 * Reusable SearchFilter component for filtering with inputs and dropdowns
 * Consolidates Activity/Filters, Materials/Filters, and Deals/Filters
 *
 * @param {Object} props
 * @param {Array} props.filters - Array of filter config objects
 * @param {Object} props.formData - Form data state
 * @param {Function} props.setFormData - Form data setter
 * @param {Function} props.onSubmit - Search button handler
 * @param {Function} props.onClear - Clear button handler
 * @param {Array} props.categories - Categories for interests dropdown
 * @param {boolean} props.useTinaFields - Whether to use TinaCMS field integration
 */
function SearchFilter({
  filters = [],
  formData = {},
  setFormData,
  onSubmit,
  onClear,
  categories = [],
  useTinaFields = true,
  customDropdownComponent = null
}) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const [open, setOpen] = useState(false);
  const [localName, setLocalName] = useState(formData?.name || '');
  const dropdownRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync local state when formData.name changes externally (e.g., clear button)
  useEffect(() => {
    setLocalName(formData?.name || '');
  }, [formData?.name]);

  // Debounced update to formData when user types
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (localName !== formData?.name) {
        setFormData(prev => ({
          ...prev,
          name: localName,
        }));
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localName, formData?.name, setFormData]);

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
  }, []);

  const toggleAgency = useCallback((agency) => {
    setSelectedAgencies(prev => {
      const updated = prev.includes(agency)
        ? prev.filter(a => a !== agency)
        : [...prev, agency];
      return updated;
    });
  }, []);

  // Update formData when interests change
  useEffect(() => {
    setFormData(prev => ({ ...prev, interests: selectedInterests }));
  }, [selectedInterests, setFormData]);

  // Update formData when agencies change
  useEffect(() => {
    setFormData(prev => ({ ...prev, agencies: selectedAgencies }));
  }, [selectedAgencies, setFormData]);

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

  const handleClear = () => {
    setSelectedInterests([]);
    setSelectedAgencies([]);
    setLocalName('');
    if (onClear) onClear();
  };

  return (
    <div className="flex flex-wrap items-start gap-x-4 gap-y-4">
      {filters.map((filter, i) => {
        // Name input
        if (filter.filter === "name") {
          return (
            <input
              key={i}
              data-testid="filter-name"
              data-tina-field={useTinaFields ? tinaField(filter, 'label') : undefined}
              name={filter.filter}
              onChange={handleChange}
              value={localName}
              placeholder={filter.label}
              className="text-[14px] md:text-[16px] px-3 w-[150px] md:w-auto md:px-4 focus:outline-none placeholder-white capitalize text-white py-1 md:py-2 border primary-border rounded-xl transition-colors duration-300"
            />
          );
        }

        // Date dropdown
        if (filter.filter === 'date') {
          return (
            <DateDropdown
              key={i}
              formData={formData}
              filter={filter}
              handleChange={handleChange}
            />
          );
        }

        // Interests dropdown
        if (filter.filter === "interests") {
          return (
            <div
              key={i}
              data-testid="filter-interests"
              data-tina-field={useTinaFields ? tinaField(filter, 'label') : undefined}
              className="relative text-[14px] md:text-[16px]"
              ref={dropdownRef}
            >
              <div
                type="button"
                data-testid="filter-interests-toggle"
                onClick={() => setOpen(!open)}
                className="capitalize px-3 md:px-4 py-1 md:py-2 text-[14px] md:text-[16px] border primary-border rounded-xl bg-transparent text-white focus:outline-none flex items-center gap-x-3 md:gap-x-8 w-full"
                aria-expanded={open}
                aria-haspopup="true"
              >
                <span>
                  {filter.label} {selectedInterests.length > 0 && `(${selectedInterests.length})`}
                </span>
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
                  toggleInterest={toggleInterest}
                />
              )}
            </div>
          );
        }

        // Agencies dropdown (using custom component if provided)
        if (filter.filter === "agencies" && customDropdownComponent) {
          return (
            <div key={i} className="relative" ref={dropdownRef}>
              <div
                type="button"
                onClick={() => setOpen(!open)}
                className="capitalize px-3 md:px-4 py-1 md:py-2 text-[14px] md:text-[16px] border primary-border rounded-xl bg-transparent text-white focus:outline-none flex items-center gap-x-3 md:gap-x-8 w-full"
                aria-expanded={open}
                aria-haspopup="true"
              >
                <span>
                  Agencies {selectedAgencies.length > 0 && `(${selectedAgencies.length})`}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {open && customDropdownComponent({ selectedAgencies, toggleAgency: toggleAgency })}
            </div>
          );
        }

        // Generic text inputs (agency, type, state, etc.)
        if (['agency', 'type', 'state'].includes(filter.filter)) {
          return (
            <input
              key={i}
              data-tina-field={useTinaFields ? tinaField(filter, 'label') : undefined}
              name={filter.filter}
              onChange={handleChange}
              value={formData[filter.filter] || ''}
              placeholder={filter.label}
              className="text-[14px] md:text-[16px] px-3 w-[150px] md:w-auto md:px-4 focus:outline-none placeholder-white capitalize text-white py-1 md:py-2 border primary-border rounded-xl transition-colors duration-300"
            />
          );
        }

        return null;
      })}

      {/* Clear Button */}
      <button
        data-testid="filter-clear"
        onClick={handleClear}
        className="bg-primary text-[14px] md:text-[16px] capitalize cursor-pointer px-6 md:px-8 py-1 md:py-2 w-auto rounded hover:opacity-80 text-white"
      >
        Clear
      </button>

      {/* Search Button */}
      <button
        data-testid="filter-search"
        onClick={onSubmit}
        className="text-[14px] md:text-[16px] bg-[#1A1A1E] border border-white/15 capitalize cursor-pointer px-6 md:px-8 py-1 md:py-2 w-auto rounded hover:opacity-80 text-white"
      >
        Search
      </button>
    </div>
  );
}

export default SearchFilter;
