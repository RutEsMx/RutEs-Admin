import ButtonAction from "@/components/ButtonAction";
import FileInput from "@/components/FileInput";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import {
  OPTIONS_BLOOD_TYPES,
  OPTIONS_TYPE_SERVICES,
  SCHOOL_GRADES,
  STATES_MX,
} from "@/utils/options";
import { useFormikContext } from "formik";

const StepStudent = ({ isEdit = false }) => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();

  return (
    <div className="border border-black px-4 py-2 mt-4">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Editar Alumno" : "Crear Alumno"}
      </h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-3 md:hidden bg-red-500">
          <div className="flex flex-col items-center">
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
          {isEdit && (
            <div className="flex flex-col pt-10 gap-4">
              <label htmlFor="status" className="font-bold">
                Estado de servicio
              </label>
              <ButtonAction
                type="button"
                onClick={() => {
                  setFieldValue(
                    "status",
                    values.status === "active" ? "inactive" : "active",
                  );
                }}
                color={
                  values.status === "active" ? "bg-light-gray" : "bg-primary"
                }
              >
                {values.status === "active" ? "Desactivar" : "Activar"}
              </ButtonAction>
            </div>
          )}
        </div>
        <div className="md:col-span-2 col-span-3">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2 md:col-span-1">
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
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
            </div>
            <div className="col-span-2 md:col-span-1">
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
            </div>
            <div className="col-span-1">
              <InputField
                label="Fecha de Nacimiento"
                type="date"
                name="birthDate"
                value={values.birthDate}
                onChange={handleChange}
                error={errors.birthDate}
              />
            </div>
            <div className="col-span-1">
              <SelectField
                labelTitle="Tipo de Sangre"
                name="bloodType"
                options={OPTIONS_BLOOD_TYPES}
                placeholder="Selecciona un tipo de sangre"
                value={values.bloodType}
                onValueChange={(value) => setFieldValue("bloodType", value)}
                error={errors.bloodType}
              />
            </div>
            <div className="col-span-1">
              <InputField
                label="Alergias"
                type="text"
                name="allergies"
                value={values.allergies}
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
            </div>

            {/* <div className="col-span-1">
              <InputField
                label="Grado"
                type="text"
                name="grade"
                value={values.grade}
                onChange={handleChange}
                maxLength={1}
              />
            </div> */}

            <div className="col-span-1">
              <SelectField
                labelTitle="Grado"
                name="grade"
                options={SCHOOL_GRADES}
                placeholder="Selecciona un grado"
                value={values.grade}
                onValueChange={(value) => setFieldValue("grade", value)}
              />
            </div>

            <div className="col-span-1">
              <InputField
                label="Grupo"
                type="text"
                name="group"
                value={values.group}
                //Only acepts letters
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
                maxLength={1} //limit of characters
              />
            </div>
            <div className="col-span-1">
              <InputField
                label="Matricula"
                type="text"
                name="enrollment"
                value={values.enrollment}
                onChange={handleChange}
                error={errors.enrollment}
                maxLength={25} //limit of characters
              />
            </div>
            <div className="col-span-2 grid grid-cols-4">
              <div className="col-span-4 md:col-span-2">
                <InputField
                  label="Calle"
                  type="text"
                  name="address.street"
                  value={values.address?.street}
                  onChange={handleChange}
                  error={errors.address?.street}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Número exterior"
                  type="text"
                  name="address.number"
                  value={values.address?.number}
                  onChange={handleChange}
                  error={errors.address?.number}
                  maxLength={10} //limit of numbers
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Número interior"
                  type="text"
                  name="address.interiorNumber"
                  value={values.address?.interiorNumber}
                  onChange={handleChange}
                  error={errors.address?.interiorNumber}
                  maxLength={10} //limit of numbers
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <InputField
                  label="Codigo Postal"
                  type="text"
                  name="address.postalCode"
                  value={values.address?.postalCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  onKeyDown={(e) => {
                    // Only numbers in the zip code.
                    if (
                      !/[0-9]/.test(e.key) &&
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
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("Text");
                    if (!/^\d+$/.test(pasted)) {
                      e.preventDefault();
                    }
                  }}
                  error={errors.address?.postalCode}
                  maxLength={5} //limit of numbers
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 md:col-span-2 grid-cols-1 col-span-2">
              <div className="col-span-1">
                <InputField
                  label="Colonia"
                  type="text"
                  name="address.neighborhood"
                  value={values.address?.neighborhood}
                  onChange={handleChange}
                  error={errors.address?.neighborhood}
                />
              </div>
              <div className="col-span-1">
                <InputField
                  label="Ciudad"
                  type="text"
                  name="address.city"
                  value={values.address?.city}
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
                  error={errors.address?.city}
                />
              </div>
              <div className="col-span-1">
                <SelectField
                  labelTitle="Estado"
                  name="address.state"
                  options={STATES_MX}
                  placeholder="Selecciona un estado"
                  value={values.address?.state}
                  onValueChange={(value) =>
                    setFieldValue("address.state", value)
                  }
                  error={errors.address?.state}
                />
              </div>
              <div className="col-span-1">
                <SelectField
                  labelTitle="Tipo de Servicio"
                  name="serviceType"
                  options={OPTIONS_TYPE_SERVICES}
                  placeholder="Selecciona un tipo de servicio"
                  value={values.serviceType}
                  onValueChange={(value) => setFieldValue("serviceType", value)}
                  error={errors.serviceType}
                />
              </div>
            </div>
          </div>
          {!isEdit && (
            <div className="grid grid-rows-1 p-4">
              <div className="grid md:grid-cols-3 grid-cols-2">
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="includeFather"
                      onChange={handleChange}
                      id="includeFather"
                      checked={values?.includeFather}
                    />
                    <label htmlFor="includeFather" className="p-2">
                      Incluir papá
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="includeMother"
                      onChange={handleChange}
                      id="includeMother"
                      checked={values?.includeMother}
                    />
                    <label htmlFor="includeMother" className="p-2">
                      Incluir mamá
                    </label>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="countTutors"
                    id="countTutors"
                    value={values?.countTutors}
                    onChange={handleChange}
                    className="border border-black rounded-md p-1 w-12"
                    max={10}
                    min={0}
                  />
                  <label htmlFor="countTutors" className="p-2">
                    Cantidad de Tutores?
                  </label>
                </div>
              </div>
              <div>
                <span className="text-red-500">
                  {errors?.includeFather || errors?.includeMother}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="md:col-span-1 hidden md:block">
          <div className="flex flex-col items-center">
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
          {isEdit && (
            <div className="flex flex-col pt-10 gap-4">
              <label htmlFor="status" className="font-bold">
                Estado de servicio
              </label>
              <ButtonAction
                type="button"
                onClick={() => {
                  setFieldValue(
                    "status",
                    values.status === "active" ? "inactive" : "active",
                  );
                }}
                color={
                  values.status === "active" ? "bg-light-gray" : "bg-primary"
                }
              >
                {values.status === "active" ? "Desactivar" : "Activar"}
              </ButtonAction>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepStudent;
