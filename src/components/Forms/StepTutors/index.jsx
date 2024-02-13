"use client";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import { useFormikContext } from "formik";
import FileInput from "@/components/FileInput";
import { PlusIcon } from "@heroicons/react/24/outline";
import ButtonAction from "@/components/ButtonAction";
import { db } from "@/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { downloadURL } from "@/utils/functionsClient";
import { setAlert } from "@/store/useSystemStore";
import { useAuthContext } from "@/context/AuthContext";

const StepTutors = ({ step }) => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  const [title, setTitle] = useState(0);
  const [stepTutors, setStepTutors] = useState(0);
  const [oldStep, setOldStep] = useState(step);
  const [emailExist, setEmailExist] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const { profile } = useAuthContext();

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
  }, [step]);

  const findEmailFirestore = async (e) => {
    const email = e.target.value;
    setFieldValue(`tutors_${stepTutors}.email`, email);
    if (email.length > 3) {
      try {
        const qProfile = query(
          collection(db, "profile"),
          where("email", "==", email),
          where("schoolId", "==", profile.schoolId),
        );
        const response = await getDocs(qProfile);
        if (response.empty) {
          setEmailExist(false);
          setFieldValue(`tutors_${stepTutors}.emailExist`, false);
          return;
        }
        if (response.docs.length > 0) {
          setEmailExist(true);
          const data = response.docs[0].data();
          setEmailData(data);
          return;
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: "Ocurrió un error al buscar el correo electrónico",
        });
      }
    }
  };

  const addEmailData = async (e) => {
    e.preventDefault();

    setFieldValue(`tutors_${stepTutors}.name`, emailData.name);
    setFieldValue(`tutors_${stepTutors}.lastName`, emailData.lastName);
    setFieldValue(
      `tutors_${stepTutors}.secondLastName`,
      emailData.secondLastName,
    );
    setFieldValue(`tutors_${stepTutors}.phone`, emailData.phone);
    setFieldValue(`tutors_${stepTutors}.id`, emailData.id);
    setFieldValue(`tutors_${stepTutors}.students`, emailData.students);
    if (emailData?.avatar) {
      const url = await downloadURL(emailData.avatar);
      setFieldValue(`tutors_${stepTutors}.avatar`, url);
    }
    setFieldValue(`tutors_${stepTutors}.emailExist`, true);
  };

  return (
    <div className="border border-black px-4 py-2 mt-4">
      <h1 className="text-2xl font-bold">{`Nuevo tutor (${title})`}</h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Correo Electrónico"
              type="email"
              name={`tutors_${stepTutors}.email`}
              value={values?.["tutors_" + stepTutors]?.email || ""}
              onChange={findEmailFirestore}
              placeholder="Dato requerido para iniciar sesión"
              error={errors?.["tutors_" + stepTutors]?.email}
            />
            <div className="col-span-1 flex flex-col ms-2">
              {emailExist && (
                <>
                  <p className="text-xs text-gray-500">
                    El correo electrónico ya existe en la base de datos
                  </p>
                  <span>¿Quiere asignar este tutor al alumno?</span>
                  <ButtonAction onClick={addEmailData}>
                    <PlusIcon className="h-5 w-5 text-black" />
                  </ButtonAction>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nombre(s)"
              type="text"
              name={`tutors_${stepTutors}.name`}
              value={values?.["tutors_" + stepTutors]?.name || ""}
              onChange={handleChange}
              error={errors?.["tutors_" + stepTutors]?.name}
            />
            <InputField
              label="Apellido Paterno"
              type="text"
              name={`tutors_${stepTutors}.lastName`}
              value={values?.["tutors_" + stepTutors]?.lastName || ""}
              onChange={handleChange}
              error={errors?.["tutors_" + stepTutors]?.lastName}
            />
            <InputField
              label="Apellido Materno"
              type="text"
              name={`tutors_${stepTutors}.secondLastName`}
              value={values?.["tutors_" + stepTutors]?.secondLastName || ""}
              onChange={handleChange}
            />
            <InputField
              label="Teléfono"
              type="text"
              name={`tutors_${stepTutors}.phone`}
              value={values?.["tutors_" + stepTutors]?.phone || ""}
              onChange={handleChange}
              error={errors?.["tutors_" + stepTutors]?.phone}
              maxLength={10}
            />
            <div className="grid grid-rows-1 p-4">
              <div className="grid grid-cols-3">
                <div className="flex justify-around">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={`tutors_${stepTutors}.active`}
                      onChange={() =>
                        setFieldValue(
                          `tutors_${stepTutors}.active`,
                          !values?.["tutors_" + stepTutors]?.active,
                        )
                      }
                      id={`active_${stepTutors}`}
                      checked={
                        values?.["tutors_" + stepTutors]?.active || false
                      }
                    />
                    <label htmlFor={`active_${stepTutors}`} className="p-2">
                      Activo
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col">
            <FileInput
              label="Avatar"
              name={`tutors_${stepTutors}.avatar`}
              value={values?.["tutors_" + stepTutors]?.avatar || ""}
              onChange={(event) => {
                setFieldValue(
                  `tutors_${stepTutors}.avatar`,
                  event.currentTarget.files[0],
                );
              }}
              error={errors.avatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepTutors;
