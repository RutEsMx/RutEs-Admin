"use client";
import { memo, useCallback, useEffect, useState } from "react";
import Autocomplete from "@/components/Autocomplete";
import InputField from "@/components/InputField";
import { getAllUnits } from "@/services/UnitsServices";
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

  const getUnitsCapacity = useCallback(async (e) => {
    setFieldValue("capacity", e.target.value);
    const units = unitsRoutes.filter((unit) => unit.passengers >= e.target.value);
    const unitsWithCapacity = units.map((unit) => {
      return {
        ...unit,
        name: unit.plate,
      };
    })
    setUnitsWithCapacity(unitsWithCapacity);
  }, [setFieldValue, unitsRoutes]);

  // const allData = useCallback(async (id) => {
  //   try {
  //     await getAllData(id, values);
  //   } catch (error) {
  //     if (error.name === "AbortError") {
  //       console.log("Fetch aborted");
  //     } else {
  //       console.error(error);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (values.routeId === null) return;
  //   allData(values.routeId);
  // }, [allData, values.routeId]);

  const handleOnChane = (type, value) => {
    // if (value === "") {
    //   if (type === "unit") {
    //     setFieldValue("unit", null);
    //     getAllUnits({ all: true, passengers: values.capacity });
    //   }
    //   if (type === "auxiliar") {
    //     setFieldValue("auxiliar", null);
    //     getAllAuxiliars({ all: true });
    //   }
    //   if (type === "driver") {
    //     setFieldValue("driver", null);
    //     getAllDrivers({ all: true });
    //   }
    // }
  };

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
        onChange={(value) => handleOnChane("unit", value)}
        error={errors.unit}
        value={values?.unit}
        name="unit"
      />
      <Autocomplete
        options={auxiliarsRoutes}
        placeholder="Selecciona un auxiliar"
        label="Auxiliar"
        onSelect={(value) => setFieldValue("auxiliar", value)}
        onChange={(value) => handleOnChane("auxiliar", value)}
        error={errors.auxiliar}
        value={values?.auxiliar}
        name="auxiliar"
      />
      <Autocomplete
        options={driversRoutes}
        placeholder="Selecciona un conductor"
        label="Conductor"
        onSelect={(value) => setFieldValue("driver", value)}
        onChange={(value) => handleOnChane("driver", value)}
        error={errors.driver}
        value={values?.driver}
        name="driver"
      />
    </div>
  );
};

const MemoStepRoute = memo(StepRoute);

export default MemoStepRoute;
