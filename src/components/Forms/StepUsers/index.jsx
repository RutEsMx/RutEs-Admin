import FileInput from "@/components/FileInput";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthContext";
import {
  OPTIONS_USER_ROLES_ADMIN_RUTES,
  OPTIONS_USER_ROLES_ADMIN,
} from "@/utils/options";
import { Field, useFormikContext } from "formik";

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
            <div className="flex flex-col m-2">
              <Label htmlFor="roles" className="mb-1">
                Roles
              </Label>
              <Field
                name="roles"
                component="select"
                multiple={true}
                onChange={handleChange}
                className="border border-gray rounded-sm p-1 h-full text-sm"
              >
                {isAdminRutes
                  ? OPTIONS_USER_ROLES_ADMIN_RUTES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))
                  : OPTIONS_USER_ROLES_ADMIN.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
              </Field>
              {errors?.roles && (
                <span className="text-red-500 text-xs pt-1">
                  {errors?.roles}
                </span>
              )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepUsers;
