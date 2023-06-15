import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { OPTIONS_BLOOD_TYPES, OPTIONS_TYPE_SERVICES } from "@/utils/options";
import { useFormikContext } from "formik";

const StepStudent = () => {
  const { values, handleChange, errors } = useFormikContext();
  
  return (
    <div>
      <h1>Nuevo Alumno</h1>
      <div className="grid grid-cols-3 gap-4 border border-black p-4">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Nombre(s)"
              type="text"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              error={errors.firstName}
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
              label="Fecha de Nacimiento"
              type="date"
              name="birthDate"
              value={values.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
            />
            <SelectField
              labelTitle="Tipo de Sangre"
              name="bloodType"
              options={OPTIONS_BLOOD_TYPES}
            />
            <InputField
              label="Alergias"
              type="text"
              name="allergies"
              value={values.allergies}
              onChange={handleChange}
            />
            <InputField
              label="Grado"
              type="text"
              name="grade"
              value={values.grade}
              onChange={handleChange}
            />
            <InputField
              label="Grupo"
              type="text"
              name="group"
              value={values.group}
              onChange={handleChange}
            />
            <InputField
              label="Matricula"
              type="text"
              name="enrollment"
              value={values.enrollment}
              onChange={handleChange}
              error={errors.enrollment}
            />
            <SelectField
              labelTitle="Tipo de Servicio"
              name="serviceType"
              options={OPTIONS_TYPE_SERVICES}
              error={errors.serviceType}
            />
          </div>
          <div className="grid grid-rows-1 p-4">
            <div className="grid grid-cols-3">
              <div className="flex justify-around">
                <div className="flex items-center">
                  <input type="checkbox" name="includeFather" onChange={handleChange} id="includeFather" checked={values?.includeFather}/>
                  <label htmlFor="includeFather" className="p-2">Incluir papá</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" name="includeMother" onChange={handleChange} id="includeMother" checked={values?.includeMother} />
                  <label htmlFor="includeMother" className="p-2">Incluir mamá</label>
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
                  <label htmlFor="countTutors" className="p-2">Cantidad de Tutores?</label>
                </div>
            </div>
            <div>
              <span className="text-red ">{errors?.includeFather || errors?.includeMother}</span>
            </div>
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

export default StepStudent;