import Autocomplete from "@/components/Autocomplete";
import InputField from "@/components/InputField";
import { getAllUnits } from "@/services/UnitsServices";
import { useAuxiliarsStore } from "@/store/useAuxiliarsStore";
import { useDriversStore } from "@/store/useDriversStore";
import { useFormikContext } from "formik";
import { memo, useEffect, useState } from "react";

const StepRoute = () => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  // const { allUnits } = useUnitsStore();
  const [units, setUnits] = useState([]);
  const { allAuxiliars } = useAuxiliarsStore();
  const { allDrivers } = useDriversStore();

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const getUnitsCapacity = async () => {
      try {
        const unitsResponse = await getAllUnits(
          { all: true, passengers: values.capacity },
          { signal },
        );
        if (unitsResponse?.error) return setUnits([]);
        setUnits(unitsResponse);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error(error);
        }
      }
    };
    if (values.capacity > 0) {
      getUnitsCapacity();
    }
    return () => {
      abortController?.abort();
    };
  }, [values.capacity]);

  return (
    <div className="mb-4 ">
      <InputField
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
        options={units}
        placeholder="Selecciona una unidad"
        label="Unidad"
        onSelect={(value) => setFieldValue("unit", value)}
        error={errors.unit}
        value={values.unit}
        name="unit"
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
      />
    </div>
  );
};

const MemoStepRoute = memo(StepRoute);

export default MemoStepRoute;
