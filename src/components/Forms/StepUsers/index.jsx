import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { OPTIONS_USER_ROLES, OPTIONS_USER_ROLES_ADMIN } from "@/utils/options";
import { useFormikContext } from "formik";

const StepUsers = () => {
  const { values, handleChange, errors } = useFormikContext();
  
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 p-4 ">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Nombre(s)"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Apellido Paterno"
              type="text"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
            <InputField
              label="Apellido Materno"
              type="text"
              name="secondLastName"
              value={values.secondLastName}
              onChange={handleChange}
            />
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
            />
            <SelectField
              labelTitle="Tipo de usuario"
              name="roles"
              options={OPTIONS_USER_ROLES_ADMIN}
              error={errors.roles}
              multiple={true}
            />
          </div>
        </div>
        <div className="">
          {/* Avatar */}
          <div className="flex flex-col">
            <label htmlFor="avatar">Avatar</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepUsers;