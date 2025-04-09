import FileInput from "@/components/FileInput";
import InputField from "@/components/InputField";
import { useFormikContext } from "formik";

const StepDriver = ({ isEdit }) => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();

  return (
    <div className="border border-black px-4 py-2 mt-4">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Editar conductor" : "Crear conductor"}
      </h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              //modifique en nombres y apellidos en onChane y adicione el onKeyDown
              label="Nombre(s)"
              type="text"
              name="name"
              value={values.name}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) {
                  handleChange(e);
                }
              }}
              onKeyDown={(e) => {
                if (
                  !/^[a-zA-ZÀ-ÿ\s]$/.test(e.key) &&
                  ![
                    "Backspace",
                    "Tab",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              error={errors.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Apellido Paterno"
              type="text"
              name="lastName"
              value={values.lastName}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) {
                  handleChange(e);
                }
              }}
              onKeyDown={(e) => {
                if (
                  !/^[a-zA-ZÀ-ÿ\s]$/.test(e.key) &&
                  ![
                    "Backspace",
                    "Tab",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              error={errors.lastName}
            />
            <InputField
              label="Apellido Materno"
              type="text"
              name="secondLastName"
              value={values.secondLastName}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) {
                  handleChange(e);
                }
              }}
              onKeyDown={(e) => {
                if (
                  !/^[a-zA-ZÀ-ÿ\s]$/.test(e.key) &&
                  ![
                    "Backspace",
                    "Tab",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
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
              label="Número de administrador"
              type="text"
              name="adminNumber"
              value={values.adminNumber}
              onChange={handleChange}
              error={errors.adminNumber}
              maxLength={10}
              //Limite el numero de adminitrador a 10 caracteres
            />
            <InputField
              label="Licencia de conducir"
              type="text"
              name="license"
              value={values.license}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                handleChange(e);
              }}
              //considero que en letras mayusculas se podira usar para mantener un estandar
              error={errors.license}
              maxLength={10}
              //limite a 10 el numero de la licencia
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col">
            <FileInput
              label="Avatar"
              name="avatar"
              value={values.avatar}
              onChange={(event) => {
                setFieldValue("avatar", event.currentTarget.files[0]);
              }}
              error={errors.avatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDriver;
