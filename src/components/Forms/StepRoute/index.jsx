"use client";
import { memo, useCallback, useState } from "react";
import Autocomplete from "@/components/Autocomplete";
import InputField from "@/components/InputField";
import { useAuxiliarsStore } from "@/store/useAuxiliarsStore";
import { useDriversStore } from "@/store/useDriversStore";
import { useUnitsStore } from "@/store/useUnitsStore";
import { useFormikContext } from "formik";

const StepRoute = () => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  const { auxiliarsRoutes } = useAuxiliarsStore();
  const { driversRoutes } = useDriversStore();
  const { unitsRoutes } = useUnitsStore();
  const [unitsWithCapacity, setUnitsWithCapacity] = useState([]);

  const getUnitsCapacity = useCallback(
    async (e) => {
      setFieldValue("capacity", e.target.value);
      const units = unitsRoutes.filter(
        (unit) => unit.passengers >= e.target.value,
      );
      const unitsWithCapacity = units.map((unit) => {
        return {
          ...unit,
          name: unit.plate,
        };
      });
      setUnitsWithCapacity(unitsWithCapacity);
    },
    [setFieldValue, unitsRoutes],
  );

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
        onChange={(value) => getUnitsCapacity(value)}
        error={errors.capacity}
        min={1}
        max={100}
        className="w-20"
      />
      <Autocomplete
        options={unitsWithCapacity}
        placeholder="Selecciona una unidad"
        label="Unidad"
        onSelect={(value) => setFieldValue("unit", value)}
        error={errors.unit}
        value={values?.unit}
        name="unit"
      />
      <Autocomplete
        options={auxiliarsRoutes}
        placeholder="Selecciona un auxiliar"
        label="Auxiliar"
        onSelect={(value) => setFieldValue("auxiliar", value)}
        error={errors.auxiliar}
        value={values?.auxiliar}
        name="auxiliar"
      />
      <Autocomplete
        options={driversRoutes}
        placeholder="Selecciona un conductor"
        label="Conductor"
        onSelect={(value) => setFieldValue("driver", value)}
        error={errors.driver}
        value={values?.driver}
        name="driver"
      />
    </div>
  );
};

const MemoStepRoute = memo(StepRoute);

export default MemoStepRoute;
