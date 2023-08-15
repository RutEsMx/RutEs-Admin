// Create autocomplete component

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Autocomplete = ({ options, onSelect, placeholder, label, error }) => {
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
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative m-2 text-xs" ref={ref}>
      {label && 
        <label htmlFor={label} className="mb-1">
          {label}
        </label>
      }
      <div className="flex ">
        <input
          type="text"
          className="w-full h-8 px-3 text-base placeholder-gray-600 placeholder:text-xs border rounded-l-sm border-gray focus:shadow-outline"
          placeholder={placeholder}
          value={search}
          onChange={handleSearch}
        />
        <button
          className="h-8 px-2 text-base font-medium text-gray-600 bg-gray-200 bg-gray border border-gray rounded-r-sm hover:bg-gray-300 focus:outline-none focus:shadow-outline"
        >
          <ChevronDownIcon className="w-5 h-5" />
        </button>
      </div>
      {error && <span className="text-red">{error}</span>}
      {showOptions && (
        <div className="absolute z-10 w-full overflow-auto bg-white rounded-sm shadow top-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="px-3 py-2 cursor-pointer hover:bg-gray"
              onClick={() => handleSelect(option)}
            >
              <span className="font-bold">Nombre:</span> {option.name}{" "}
              {option?.passengers && (
                <>
                  <span className="font-bold">Pasajeros:</span>{" "}
                  {option.passengers}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
