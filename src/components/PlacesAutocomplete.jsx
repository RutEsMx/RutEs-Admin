import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const PlacesAutocomplete = ({ address, setAddress }) => {
  return (
    <div className="w-full m-2">
      <GooglePlacesAutocomplete
        apiOptions={{
          language: "es-419",
          region: "mx",
        }}
        selectProps={{
        //   value,
        //   onChange: setValue,
          placeholder: "Buscar dirección...",
          noOptionsMessage: () => "No hay resultados",
          loadingMessage: () => "Cargando...",
          styles: {
            option: (provided) => ({
              ...provided,
              cursor: "pointer",
            }),
          },
          classNames: {
            option: () => "text-sm text-nandor hover:bg-gray p-2",
            menu: () => "text-sm border border-gray rounded-lg px-2 bg-white p-4",
            control: () => "text-sm border border-gray rounded-lg px-8 text-nandor",
            singleValue: () => "text-nandor",
            indicatorSeparator: () => "invisible fill-black",
            dropdownIndicator: () => "text-nandor px-1",
            loadingIndicator: () => "text-gray",
            placeholder: () => "text-gray",
          },
          unstyled: true,
        }}
        
      />
    </div>
  )
}

export default PlacesAutocomplete