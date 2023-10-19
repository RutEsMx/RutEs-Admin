// Create autocomplete component
import AsyncSelect from "react-select/async";

const SelectAutocomplete = ({
  onSelect,
  placeholder,
  label,
  error,
  value: valueControl,
  disabled,
  days,
}) => {
  console.log("🚀 ~ file: SelectAutocomplete.jsx:13 ~ valueControl:", valueControl)
  const handleSelect = (option) => {
    if (disabled) return;
    console.log("🚀 ~ file: SelectAutocomplete.jsx:16 ~ handleSelect ~ option:", option)
    onSelect(option);
  };
  
  const handleSearch = async (value) => {
    const options = await filteredOptions(value);
    const formatOptions = options.map((option) => ({
      value: option.id,
      label: `${option?.name} ${option?.lastName} ${option?.secondLastName}-${option?.grade}${option?.group}`,
      ...option,
    }));
    return formatOptions;
  };
  
  const filteredOptions = (value) => {
    if (value.length < 3) return [];
    return fetch("/api/students/search?value=" + value + "&days=" + days)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));
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
          // defaultValue={value}
          onChange={handleSelect}
          isClearable
          isDisabled={disabled}
          isSearchable
          noOptionsMessage={() => "No hay resultados"}
          loadingMessage={() => "Cargando..."}
          value={valueControl}
        />
      </div>
      {error && <span className="text-red">{error}</span>}
    </div>
  );
};

export default SelectAutocomplete;
