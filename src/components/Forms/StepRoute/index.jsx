import Autocomplete from "@/components/Autocomplete";
import InputField from "@/components/InputField";
import { useFormikContext } from "formik";

const StepRoute = () => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();

  return (
    <div className="border border-black px-4 py-2 mt-4">
      <h1 className="text-2xl font-bold">Nueva ruta</h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-1">
          <div className="grid grid-cols-1 gap-4 mb-4">
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
              options={[
                { id: 1, name: 'Reforma' },
                { id: 2, name: 'Polanco' },
                { id: 3, name: 'Santa Fe' },
              ]}
              placeholder="Selecciona una unidad"
              label="Unidad"
              onSelect={(value) => setFieldValue('unit', value)}
              error={errors.unit}
              value={values.unit}
              name="unit"
            />
            <Autocomplete 
              options={[
                { id: 1, name: 'Susana' },
                { id: 2, name: 'Rodrigo' },
                { id: 3, name: 'Guadalupe' },
              ]}
              placeholder="Selecciona un auxiliar"
              label="Auxiliar"
              onSelect={(value) => setFieldValue('aux', value)}
              error={errors.aux}
              value={values.aux}
              name="aux"
            />
            <Autocomplete 
              options={[
                { id: 1, name: 'Luis' },
                { id: 2, name: 'Armando' },
                { id: 3, name: 'Rodolfo' },
              ]}
              placeholder="Selecciona un conductor"
              label="Conductor"
              onSelect={(value) => setFieldValue('driver', value)}
              error={errors.driver}
              value={values.driver}
              name="driver"
            />
          </div>
        </div>
        <div className="">
          {/* Map */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <label htmlFor="avatar">Maps</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepRoute;
