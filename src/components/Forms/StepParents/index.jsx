import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import { useFormikContext } from "formik";
import FileInput from "@/components/FileInput";

const StepParents = ({ validation }) => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  const [type, setType] = useState("father");
  const [title, setTitle] = useState("Padre");

  useEffect(() => {
    setType(validation?._nodes[0]);
    setTitle(validation?._nodes[0] === "father" ? "Padre" : "Madre");
  }, [validation]);

  return (
    <div className="border border-black px-4 py-2 mt-4">
      <h1 className="text-2xl font-bold">{`Nuevo Familiar (${title})`}</h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Correo Electrónico"
              type="email"
              name={`${type}.email`}
              value={values[type].email}
              onChange={handleChange}
              placeholder="Dato requerido para iniciar sesión"
              error={errors[type]?.email}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nombre(s)"
              type="text"
              name={`${type}.name`}
              value={values[type].name}
              onChange={handleChange}
              error={errors[type]?.name}
            />
            <InputField
              label="Apellido Paterno"
              type="text"
              name={`${type}.lastName`}
              value={values[type].lastName}
              onChange={handleChange}
              error={errors[type]?.lastName}
            />
            <InputField
              label="Apellido Materno"
              type="text"
              name={`${type}.secondLastName`}
              value={values[type].secondLastName}
              onChange={handleChange}
            />
            <InputField
              label="Teléfono"
              type="text"
              name={`${type}.phone`}
              value={values[type].phone}
              onChange={handleChange}
              error={errors[type]?.phone}
              maxLength={10}
            />
            <InputField
              label="Teléfono de Emergencia"
              type="text"
              name={`${type}.phoneEmergency`}
              value={values[type].phoneEmergency}
              onChange={handleChange}
              error={errors[type]?.phoneEmergency}
            />
            <InputField
              label="Teléfono de Familia"
              type="text"
              name={`${type}.phoneFamily`}
              value={values[type].phoneFamily}
              onChange={handleChange}
              error={errors[type]?.phoneFamily}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col">
            <FileInput
              label="Avatar"
              name={`${type}.avatar`}
              value={values[type].avatar}
              onChange={(event) => {
                setFieldValue(`${type}.avatar`, event.currentTarget.files[0]);
              }}
              error={errors.avatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepParents;
