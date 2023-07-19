import InputField from "@/components/InputField";
import { useFormikContext } from "formik";

const StepSchool = () => {
  const { values, handleChange, errors } = useFormikContext();

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 p-4 ">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Nombre"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Correo electrónico"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              label="Teléfono"
              type="text"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              error={errors.phone}
              maxLength={10}
            />
            <InputField
              label="Clave"
              type="text"
              name="clave"
              value={values.clave}
              onChange={handleChange}
              error={errors.clave}
              maxLength={10}
            />
          </div>
        </div>
        <div className="">
          {/* Logo */}
          <div className="flex flex-col">
            <label htmlFor="logo">Logo Escuela</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSchool;
