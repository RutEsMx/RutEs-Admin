import { useEffect, useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

const PlacesAutocomplete = ({ label, place, setPlace }) => {
  const [value, setValue] = useState(place);

  useEffect(() => {
    if (!place) {
      setValue(null);
    }
  }, [place]);

  return (
    <div className="ml-2 mb-2 pt-2">
      {label && <label className="text-sm text-gray">{label}</label>}
      <GooglePlacesAutocomplete
        autocompletionRequest={{
          types: () => ["locality", "address", "postal_code"],
          componentRestrictions: {
            country: ["mx"],
          },
        }}
        apiOptions={{
          language: "es-419",
          region: "mx",
        }}
        selectProps={{
          value,
          onChange: (value) => {
            setValue(value);
            geocodeByAddress(value?.label)
              .then((results) => getLatLng(results[0]))
              .then(({ lat, lng }) => {
                setPlace({
                  label: value.label,
                  lat,
                  lng,
                });
              });
          },
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
            menu: () =>
              "text-sm border border-gray rounded-sm px-2 bg-white p-4",
            control: () =>
              "text-sm border border-gray rounded-sm pl-2 text-nandor autocomplet-min-h h-8",
            singleValue: () => "text-nandor",
            indicatorSeparator: () => "invisible fill-black",
            dropdownIndicator: () => "text-nandor px-2",
            loadingIndicator: () => "text-gray",
            placeholder: () => "text-gray",
          },
          unstyled: true,
        }}
      />
    </div>
  );
};

export default PlacesAutocomplete;
