// Create autocomplete component
import AsyncSelect from "react-select/async";

const SelectAutocomplete = ({
  onSelect,
  placeholder,
  label,
  error,
  value: valueControl,
  disabled,
  options,
}) => {
  const handleSelect = (option) => {
    if (disabled) return;
    onSelect(option);
  };

  const handleSearch = async (value) => {
    const options = await filteredOptions(value);
    return options;
  };

  const filteredOptions = (value) => {
    // filtrar por dias days
    if (value.length < 3) return [];
    return options.filter((option) => {
      const { label } = option;
      return label.toLowerCase().includes(value.toLowerCase());
    });
  };

  return (
    <div className="relative ml-2 text-xs">
      {label && (
        <label htmlFor={label} className="mb-1">
          {label}
        </label>
      )}
      <div className="flex ">
        <AsyncSelect
          loadOptions={handleSearch}
          className="w-full h-8 text-sm  placeholder-gray-600 placeholder:text-xs  rounded-l-sm  focus:shadow-outline"
          placeholder={placeholder}
          defaultOptions={options}
          onChange={handleSelect}
          isClearable
          isDisabled={disabled}
          isSearchable
          noOptionsMessage={() => "No hay resultados"}
          loadingMessage={() => "Cargando..."}
          value={valueControl}
        />
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default SelectAutocomplete;
