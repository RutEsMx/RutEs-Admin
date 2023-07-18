import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import { useFormikContext } from "formik";

const StepTutors = ({ step }) => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  const [title, setTitle] = useState(0);
  const [stepTutors, setStepTutors] = useState(0);
  const [oldStep, setOldStep] = useState(step);

  useEffect(() => {
    if (step > oldStep) {
      setTitle(title + 1);
      setStepTutors(stepTutors + 1);
    } else if (step < oldStep) {
      setTitle(title - 1);
      setStepTutors(stepTutors - 1);
    } else {
      setTitle(title + 1);
      setStepTutors(0);
    }
    setOldStep(step);
  }, [step])
  
  return (
    <div>
      <h1>{`Nuevo tutor (${title})`}</h1>
      <div className="grid grid-cols-3 gap-4 border border-black p-4">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Correo Electrónico"
              type="email"
              name={`tutors_${stepTutors}.email`}
              value={values?.['tutors_'+stepTutors]?.email || ''}
              onChange={handleChange}
              placeholder="Dato requerido para iniciar sesión"
              error={errors?.['tutors_'+stepTutors]?.email}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nombre(s)"
              type="text"
              name={`tutors_${stepTutors}.name`}
              value={values?.['tutors_'+stepTutors]?.name || ''}
              onChange={handleChange}
              error={errors?.['tutors_'+stepTutors]?.name}
            />
           <InputField
              label="Apellido Paterno"
              type="text"
              name={`tutors_${stepTutors}.lastName`}
              value={values?.['tutors_'+stepTutors]?.lastName || ''}
              onChange={handleChange}
              error={errors?.['tutors_'+stepTutors]?.lastName}
            />
            <InputField
              label="Apellido Materno"
              type="text"
              name={`tutors_${stepTutors}.secondLastName`}
              value={values?.['tutors_'+stepTutors]?.secondLastName || ''}
              onChange={handleChange}
            />
            <InputField
              label="Teléfono"
              type="text"
              name={`tutors_${stepTutors}.phone`}
              value={values?.['tutors_'+stepTutors]?.phone || ''}
              onChange={handleChange}
              error={errors?.['tutors_'+stepTutors]?.phone}
              maxLength={10}
            />
            <div className="grid grid-rows-1 p-4">
              <div className="grid grid-cols-3">
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={`tutors_${stepTutors}.active`}
                      onChange={() => setFieldValue(`tutors_${stepTutors}.active`, !values?.['tutors_'+stepTutors]?.active)}
                      id={`active_${stepTutors}`}
                      checked={values?.['tutors_'+stepTutors]?.active || false}
                    />
                    <label htmlFor={`active_${stepTutors}`} className="p-2">Activo</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col">
            <label htmlFor="avatar">Avatar</label>
          </div>
        </div> 
      </div>
    </div>
  );
}

export default StepTutors
