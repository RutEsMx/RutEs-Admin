"use client";
import Autocomplete from "@/components/Autocomplete";
import InputField from "@/components/InputField";
import { getAllAuxiliars } from "@/services/AuxiliarsServices";
import { getAllDrivers } from "@/services/DriverServices";
import { getAllUnits } from "@/services/UnitsServices";
import { useAuxiliarsStore } from "@/store/useAuxiliarsStore";
import { useDriversStore } from "@/store/useDriversStore";
import { useUnitsStore } from "@/store/useUnitsStore";
import { useFormikContext } from "formik";
import { memo, useCallback, useEffect } from "react";

const getAllData = async (id = null) => {
  try {
    return Promise.all([
      getAllDrivers({ all: true, route: id }),
      getAllUnits({ all: true, route: id }),
      getAllAuxiliars({ all: true, route: id }),
    ]);
  } catch (error) {
    return { error: error.message };
  }
};

const StepRoute = () => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  const { allUnits } = useUnitsStore();
  const { allAuxiliars } = useAuxiliarsStore();
  const { allDrivers } = useDriversStore();

  const getUnitsCapacity = useCallback(async (e) => {
    setFieldValue("capacity", e.target.value);
    try {
      setFieldValue("unit", null);
      await getAllUnits({ all: true, passengers: e.target.value });
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if (values.routeId === null) return;
    const allData = async () => {
      getAllData(values.routeId);
    };
    allData();
  }, []);

  // useEffect(() => {
  //   if (values.capacity > 0) {
  //     getUnitsCapacity();
  //   }
  // }, [values.capacity]);

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
        options={allUnits}
        placeholder="Selecciona una unidad"
        label="Unidad"
        onSelect={(value) => setFieldValue("unit", value)}
        error={errors.unit}
        value={values?.unit}
        name="unit"
      />
      <Autocomplete
        options={allAuxiliars}
        placeholder="Selecciona un auxiliar"
        label="Auxiliar"
        onSelect={(value) => setFieldValue("auxiliar", value)}
        error={errors.auxiliar}
        value={values?.auxiliar}
        name="auxiliar"
      />
      <Autocomplete
        options={allDrivers}
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
