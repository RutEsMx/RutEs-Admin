import InputField from "@/components/InputField";
import { useFormikContext } from "formik";

const StepUnits = ({ isEdit }) => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();

  const handleAlphaNumInput = (e, field, max) => {
    const formatted = e.target.value
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, max)
      .toUpperCase();
    setFieldValue(field, formatted);
  };

  const handleYearInput = (e) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/\D/g, "").slice(0, 4);
    setFieldValue("year", cleaned);
  };

  const handlePassengersInput = (e) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/\D/g, "").slice(0, 2);
    setFieldValue("passengers", cleaned);
  };

  const restrictToDigits = (e) => {
    if (
      !/^\d$/.test(e.key) &&
      !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="border border-black px-4 py-2 mt-4">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Editar unidad" : "Crear unidad"}
      </h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Modelo"
              type="text"
              name="model"
              value={values.model}
              onChange={handleChange}
              onInput={(e) => handleAlphaNumInput(e, "model", 10)}
              maxLength={10}
              error={errors.model}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Año"
              type="text"
              name="year"
              value={values.year}
              onInput={handleYearInput}
              onKeyDown={restrictToDigits}
              maxLength={4}
              inputMode="numeric"
              error={errors.year}
            />
            <InputField
              label="Placas"
              type="text"
              name="plate"
              value={values.plate}
              onChange={handleChange}
              onInput={(e) => handleAlphaNumInput(e, "plate", 8)}
              maxLength={8}
              error={errors.plate}
            />
            <InputField
              label="Número administrativo"
              type="text"
              name="adminNumber"
              value={values.adminNumber}
              onChange={handleChange}
              onInput={(e) => handleAlphaNumInput(e, "adminNumber", 8)}
              maxLength={8}
              error={errors.adminNumber}
            />
            <InputField
              label="Cantidad de pasajeros"
              type="text"
              name="passengers"
              value={values.passengers}
              onInput={handlePassengersInput}
              onKeyDown={restrictToDigits}
              maxLength={2}
              inputMode="numeric"
              error={errors.passengers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepUnits;
