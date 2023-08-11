import Autocomplete from "@/components/Autocomplete";
import InputField from "@/components/InputField";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";
import { useAuxiliarsStore } from "@/store/useAuxiliarsStore";
import { useDriversStore } from "@/store/useDriversStore";
import { useUnitsStore } from "@/store/useUnitsStore";
import { useFormikContext } from "formik";
import { memo } from "react";
import { MapPinIcon } from "@heroicons/react/24/solid";

const StepStops = () => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  // const { allUnits } = useUnitsStore();
  // const { allAuxiliars } = useAuxiliarsStore();
  // const { allDrivers } = useDriversStore();

  return (
    <div className="mb-4">
      <div className="flex flex-row items-center">
        <MapPinIcon className="h-6 w-6 text-black" />
        <PlacesAutocomplete 
          
        />
      </div>
      <Autocomplete
        options={[]}
        placeholder="Selecciona un alumno"
        onSelect={(value) => setFieldValue("student", value)}
        error={errors.student}
        value={values.student}
        name="student"
      />
      {/* <InputField
        label="Nombre"
        type="text"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <InputField
        label="Cantidad máx. de pasajeros"
        type="number"
        name="capacity"
        value={values.capacity}
        onChange={handleChange}
        error={errors.capacity}
        min={1}
        max={100}
        className="w-20"
      />
     
      <Autocomplete
        options={allAuxiliars}
        placeholder="Selecciona un auxiliar"
        label="Auxiliar"
        onSelect={(value) => setFieldValue("auxiliar", value)}
        error={errors.auxiliar}
        value={values.auxiliar}
        name="auxiliar"
      />
      <Autocomplete
        options={allDrivers}
        placeholder="Selecciona un conductor"
        label="Conductor"
        onSelect={(value) => setFieldValue("driver", value)}
        error={errors.driver}
        value={values.driver}
        name="driver"
      /> */}
    </div>
  );
};

const MemoStepStops = memo(StepStops);

export default MemoStepStops;
