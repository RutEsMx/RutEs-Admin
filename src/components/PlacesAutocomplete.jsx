"use client";
import { useEffect } from "react";
import { useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

const PlacesAutocomplete = ({ label, setPlace, place, address }) => {
  const [value, setValue] = useState(place);
  const [addressValue, setAddressValue] = useState("");

  useEffect(() => {
    setAddressValue(address);
  }, [address]);

  useEffect(() => {
    const getPlaceId = async () => {
      if (!place) {
        setValue(null);
        return;
      } else {
        if (place?.place_id) {
          setValue(place);
        }
      }
    };
    getPlaceId();
  }, [place]);

  const handleChange = async (newValue) => {
    if (newValue && newValue.label) {
      setValue(newValue);
      try {
        const results = await geocodeByAddress(newValue.label);
        const { lat, lng } = await getLatLng(results[0]);
        delete results[0].geometry;
        setPlace({
          lat,
          lng,
          label: results[0]?.formatted_address,
          ...results[0],
        });
      } catch (error) {
        console.error("Error al obtener la geolocalización:", error);
      }
    } else {
      setValue(null);
      setPlace(null);
    }
  };

  return (
    <div className="ml-2 mb-2 pt-2">
      {label && <label className="text-xs">{label}</label>}
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
          inputValue: value?.label || addressValue,
          onInputChange: (e) => {
            setAddressValue(e);
          },
          isClearable: true,
          defaultInputValue: value?.label,
          onChange: handleChange,
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
