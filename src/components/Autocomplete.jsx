// Create autocomplete component

import { useState, useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Autocomplete = ({ options, onSelect, placeholder, label }) => {
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const ref = useRef(null);

  const handleSelect = (option) => {
    onSelect(option.id);
    setSearch(option.name);
    setShowOptions(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setShowOptions(true);
  };
  
  const handleClear = () => {
    setSearch("");
    setShowOptions(false);
    onSelect(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowOptions(false);
      } else {
        setShowOptions(true);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, setShowOptions]);
  
  

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <label htmlFor={label} className="mb-1">
        {label}
      </label>
      <div className="flex">
        <input
          type="text"
          className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-l-lg focus:shadow-outline"
          placeholder={placeholder}
          value={search}
          onChange={handleSearch}
        />
        <button
          className="h-10 px-3 text-base font-medium text-gray-600 bg-gray-200 border border-gray-200 rounded-r-lg hover:bg-gray-300 focus:outline-none focus:shadow-outline"
          onClick={handleClear}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      {showOptions && (
        <div className="absolute z-10 w-full overflow-auto bg-white rounded-lg shadow top-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="px-3 py-2 cursor-pointer hover:bg-gray"
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;