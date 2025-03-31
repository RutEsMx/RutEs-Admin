import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import { useFormikContext } from "formik";
import FileInput from "@/components/FileInput";
import { db } from "@/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { PlusIcon } from "@heroicons/react/24/outline";
import ButtonAction from "@/components/ButtonAction";
import { setAlert } from "@/store/useSystemStore";
import { useAuthContext } from "@/context/AuthContext";

const StepParents = ({ validation }) => {
  const { values, handleChange, errors, setFieldValue } = useFormikContext();
  const [type, setType] = useState("father");
  const [title, setTitle] = useState("Padre");
  const [emailExist, setEmailExist] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const { profile } = useAuthContext();

  useEffect(() => {
    setType(validation?._nodes[0]);
    setTitle(validation?._nodes[0] === "father" ? "Padre" : "Madre");
  }, [validation]);

  const findEmailFirestore = async (e) => {
    const email = e.target.value;
    setFieldValue(`${type}.email`, email);
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
          setFieldValue(`${type}.emailExist`, false);
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
    setFieldValue(`${type}.name`, emailData.name);
    setFieldValue(`${type}.lastName`, emailData.lastName);
    setFieldValue(`${type}.secondLastName`, emailData.secondLastName);
    setFieldValue(`${type}.phone`, emailData.phone);
    setFieldValue(`${type}.phoneEmergency`, emailData.phoneEmergency);
    setFieldValue(`${type}.phoneFamily`, emailData.phoneFamily);
    setFieldValue(`${type}.id`, emailData.id);
    setFieldValue(`${type}.students`, emailData.students);
    if (emailData?.avatar) {
      setFieldValue(`${type}.avatar`, emailData?.avatar);
    }
    setFieldValue(`${type}.emailExist`, true);
  };

  return (
    <div className="border border-black px-4 py-2 mt-4">
      <h1 className="text-2xl font-bold">{`Nuevo Familiar (${title})`}</h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-1">
              <InputField
                label="Correo Electrónico"
                type="email"
                name={`${type}.email`}
                value={values[type].email}
                onChange={findEmailFirestore}
                placeholder="Dato requerido para iniciar sesión"
                error={errors[type]?.email}
              />
            </div>
            <div className="col-span-1 flex flex-col ms-2">
              {emailExist && (
                <>
                  <p className="text-xs text-gray-500">
                    El correo electrónico ya existe en la base de datos
                  </p>
                  <span>¿Quiere asignar este padre al alumno?</span>
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
              key={values[type].avatar}
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
