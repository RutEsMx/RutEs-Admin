import FileInput from "@/components/FileInput";
import InputField from "@/components/InputField";
import { useFormikContext } from "formik";

const StepAuxiliar = ({ isEdit }) => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();

  return (
    <div className="border border-black px-4 py-2 mt-4">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Editar auxiliar" : "Nuevo auxiliar"}
      </h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
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
              disabled={isEdit}
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Número de administrador"
              type="text"
              name="adminNumber"
              value={values.adminNumber}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, ""); // elimina todo lo que no sea número
                if (onlyNums.length <= 10) {
                  handleChange({
                    target: {
                      name: e.target.name,
                      value: onlyNums,
                    },
                  });
                }
              }}
              error={errors.adminNumber}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Contraseña"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="off"
            />
            <InputField
              label="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="ms-4 text-sm font-extralight">
              La contraseña debe contener:
              <ul className="ms-2 text-xs">
                <li>Al menos una letra mayúscula</li>
                <li>Al menos una letra minúscula</li>
                <li>Al menos un número</li>
                <li>Al menos 8 caracteres</li>
              </ul>
            </div>
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
            {errors && <span className="text-red-500">{errors.avatar}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepAuxiliar;
