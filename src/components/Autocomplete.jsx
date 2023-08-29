// Create autocomplete component

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Autocomplete = ({
  options,
  onSelect,
  placeholder,
  label,
  error,
  value,
  disabled,
}) => {
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const ref = useRef(null);

  const handleSelect = (option) => {
    if (disabled) return;
    onSelect(option.id);
    setSearch(option.name);
    setShowOptions(false);
  };

  const handleDropdown = (e) => {
    if (disabled) return;
    e.preventDefault();
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    if (value === null) {
      setSearch("");
    } else {
      const option = options.find((option) => {
        return option.id === value;
      });
      setSearch(option?.name);
    }
  }, [value, options]);

  const handleSearch = (e) => {
    e.preventDefault();
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

    if (!disabled) document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, setShowOptions, disabled]);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search?.toLowerCase()),
  );

  return (
    <div className="relative m-2 text-xs" ref={ref}>
      {label && (
        <label htmlFor={label} className="mb-1">
          {label}
        </label>
      )}
      <div className="flex ">
        <input
          type="text"
          className="w-full h-8 px-3 text-base placeholder-gray-600 placeholder:text-xs border rounded-l-sm border-gray focus:shadow-outline"
          placeholder={placeholder}
          value={search}
          onChange={handleSearch}
          disabled={disabled}
        />
        <button
          className="h-8 px-2 text-base font-medium text-gray-600 bg-gray-200 bg-gray border border-gray rounded-r-sm hover:bg-gray-300 focus:outline-none focus:shadow-outline"
          onClick={handleDropdown}
          disabled={disabled}
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
