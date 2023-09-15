import InputField from "@/components/InputField";
import { useFormikContext } from "formik";

const StepUnits = ({ isEdit }) => {
  const { values, handleChange, errors } = useFormikContext();

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
              error={errors.model}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Año"
              type="number"
              name="year"
              value={values.year}
              onChange={handleChange}
              error={errors.year}
            />
            <InputField
              label="Placas"
              type="text"
              name="plate"
              value={values.plate}
              onChange={handleChange}
              error={errors.plate}
            />
            <InputField
              label="Número administrativo"
              type="text"
              name="adminNumber"
              value={values.adminNumber}
              onChange={handleChange}
              error={errors.adminNumber}
            />
            <InputField
              label="Cantidad de pasajeros"
              type="number"
              name="passengers"
              value={values.passengers}
              onChange={handleChange}
              error={errors.passengers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepUnits;
