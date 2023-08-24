import FileInput from "@/components/FileInput";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { useAuthContext } from "@/context/AuthContext";
import {
  OPTIONS_USER_ROLES_ADMIN_RUTES,
  OPTIONS_USER_ROLES_ADMIN,
} from "@/utils/options";
import { useFormikContext } from "formik";

const StepUsers = ({ isEdit }) => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  const { profile } = useAuthContext();
  const isAdminRutes = profile?.roles?.includes("admin-rutes");

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
            <SelectField
              labelTitle="Tipo de usuario"
              name="roles"
              options={
                isAdminRutes
                  ? OPTIONS_USER_ROLES_ADMIN_RUTES
                  : OPTIONS_USER_ROLES_ADMIN
              }
              error={errors.roles}
              multiple={true}
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

export default StepUsers;
