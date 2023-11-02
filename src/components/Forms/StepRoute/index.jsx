"use client";
import { memo, useCallback, useState } from "react";
import Autocomplete from "@/components/Autocomplete";
import InputField from "@/components/InputField";
import { useAuxiliarsStore } from "@/store/useAuxiliarsStore";
import { useDriversStore } from "@/store/useDriversStore";
import { useUnitsStore } from "@/store/useUnitsStore";
import { useFormikContext } from "formik";
import { useEffect } from "react";

const StepRoute = () => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  const { auxiliarsRoutes } = useAuxiliarsStore();
  const { driversRoutes } = useDriversStore();
  const { unitsRoutes } = useUnitsStore();
  const [unitsWithCapacity, setUnitsWithCapacity] = useState([]);
  const [availableAuxiliars, setAvailableAuxiliars] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);

  const getAvailableAuxiliars =  (value) => {
      setFieldValue("auxiliar", value);
      const auxiliars = auxiliarsRoutes.filter(
        (auxiliar) => auxiliar.id !== value,
      );
      const oldAuxiliar = auxiliars.find(
        (auxiliar) => auxiliar.id === values.auxiliar,
      );
      const auxiliarWithoutRoute = auxiliars.filter(
        (auxiliar) => !auxiliar.route,
      );
      if (oldAuxiliar) {
        // si no existe en auxiliarWithoutRoute, lo agrego
        if (!auxiliarWithoutRoute.find((auxiliar) => auxiliar.id === oldAuxiliar.id)) {
          auxiliarWithoutRoute.push(oldAuxiliar);
        }
      }
      setAvailableAuxiliars(auxiliarWithoutRoute);
    }
  const getAvailableDrivers =  (value) => {
      setFieldValue("driver", value);
      const drivers = driversRoutes.filter(
        (driver) => driver.id !== value,
      );
      const oldDriver = drivers.find(
        (driver) => driver.id === values.driver,
      );
      const driverWithoutRoute = drivers.filter(
        (driver) => !driver.route,
      );
      if (oldDriver) {
        if (!driverWithoutRoute.find((driver) => driver.id === oldDriver.id)) {
          driverWithoutRoute.push(oldDriver);
        }
      }
    setAvailableDrivers(driverWithoutRoute);
    }
  
  useEffect(() => {
    setAvailableAuxiliars(auxiliarsRoutes);
    setAvailableDrivers(driversRoutes);
  }, [auxiliarsRoutes, driversRoutes])
  
  const getUnitsCapacity = useCallback(
    async (e) => {
      setFieldValue("capacity", e.target.value);
      const units = unitsRoutes.filter(
        (unit) => unit.passengers >= e.target.value,
      );
      const oldUnit = units.find((unit) => unit.id === values.unit);
      const unitWithoutRoute = units.filter((unit) => !unit.route);
      if (oldUnit?.passengers >= e.target.value) {
        if (!unitWithoutRoute.find((unit) => unit.id === oldUnit.id)) {
          unitWithoutRoute.push(oldUnit);
        }
      }
      
      setUnitsWithCapacity(unitWithoutRoute);
    },
    [setFieldValue, unitsRoutes, values.unit],
  );
  
  useEffect(() => {
    setUnitsWithCapacity(unitsRoutes);
  }, [unitsRoutes])
  
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
        onSelect={(value) => {
          setFieldValue("unit", value.id)
        }}
        error={errors.unit}
        value={values?.unit}
        name="unit"
      />
      <Autocomplete
        options={availableAuxiliars}
        placeholder="Selecciona un auxiliar"
        label="Auxiliar"
        onSelect={(value) => {
          setFieldValue("auxiliar", value.id)
          }}
        onChange={(value) => getAvailableAuxiliars(value)}
        error={errors.auxiliar}
        value={values?.auxiliar}
        name="auxiliar"
      />
      <Autocomplete
        options={availableDrivers}
        placeholder="Selecciona un conductor"
        label="Conductor"
        onSelect={(value) => {
          setFieldValue("driver", value.id)
        }}
        onChange={(value) => {
          getAvailableDrivers(value);
          }}
        error={errors.driver}
        value={values?.driver}
        name="driver"
      />
    </div>
  );
};

const MemoStepRoute = memo(StepRoute);

export default MemoStepRoute;
