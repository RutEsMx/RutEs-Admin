"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import { setAlert, useSystemStore } from "@/store/useSystemStore";
import InputField from "@/components/InputField";
import FileInput from "@/components/FileInput";
import { createTutorProfile } from "@/services/StudentsServices";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import ButtonAction from "@/components/ButtonAction";
import { PlusIcon } from "@heroicons/react/24/outline";
import { downloadURL } from "@/utils/functionsClient";
import { useAuthContext } from "@/context/AuthContext";
import { tutorMock } from "@/mocks/createStudent";
import { getParents } from "@/services/ParentsSevices";

const IS_DEV = process.env.NODE_ENV === "development";

const FormTutor = ({ data, isEdit = false, studentId }) => {
  const navigation = useRouter();
  const { alert } = useSystemStore();
  const [isLoading, setIsLoading] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const { profile } = useAuthContext();

  const initialValues = {
    name: IS_DEV ? tutorMock.name : data?.name || "",
    lastName: IS_DEV ? tutorMock.lastName : data?.lastName || "",
    secondLastName: IS_DEV
      ? tutorMock.secondLastName
      : data?.secondLastName || "",
    email: IS_DEV ? tutorMock.email : data?.email || "",
    phone: IS_DEV ? tutorMock.phone : data?.phone || "",
    isEdit,
    avatar: data?.avatar || "",
  };

  const findEmailFirestore = async (e, setFieldValue) => {
    const email = e.target.value;
    setFieldValue("email", email);
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
          setFieldValue("emailExist", false);
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

  const addEmailData = async (e, setFieldValue) => {
    e.preventDefault();

    setFieldValue("name", emailData.name);
    setFieldValue("lastName", emailData.lastName);
    setFieldValue("secondLastName", emailData.secondLastName);
    setFieldValue("phone", emailData.phone);
    setFieldValue("id", emailData.id);
    setFieldValue("students", emailData.students);
    if (emailData?.avatar) {
      const url = await downloadURL(emailData.avatar);
      setFieldValue("avatar", url);
    }
    setFieldValue("emailExist", true);
  };

  const handleNext = async (values) => {
    setIsLoading(true);
    try {
      // values.id = data?.id;
      await createTutorProfile(values, studentId, profile.schoolId, ["tutor"]);

      getParents();

      setAlert({
        type: "success",
        message: "Perfil actualizado correctamente",
        isOpen: true,
      });
      navigation.back();
      return setAlert({
        isOpen: false,
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: error?.message,
        isOpen: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    return navigation.back();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleNext}
        // validationSchema={validate}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {({
          isSubmitting,
          handleSubmit,
          values,
          handleChange,
          errors,
          setFieldValue,
        }) => (
          <Form>
            <div className="flex justify-end gap-4 -mt-8">
              <Button onClick={handleBack} color="bg-light-gray" type="button">
                {isLoading ? (
                  <span className="loading loading-dots loading-xs"></span>
                ) : (
                  "Atrás"
                )}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                type="button"
              >
                {isLoading ? (
                  <span className="loading loading-dots loading-xs"></span>
                ) : (
                  "Crear"
                )}
              </Button>
            </div>
            <div className="mt-4">
              <Alert
                isOpen={alert.isOpen}
                message={alert.message}
                type={alert.type}
              />
            </div>
            <div className="border border-black px-4 py-2 mt-4">
              <h1 className="text-2xl font-bold">{"Crear"}</h1>
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputField
                      label="Correo electrónico"
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={(e) => findEmailFirestore(e, setFieldValue)}
                      error={errors.email}
                      disabled={isEdit}
                    />
                    <div className="col-span-1 flex flex-col ms-2">
                      {emailExist && (
                        <>
                          <p className="text-xs text-gray-500">
                            El correo electrónico ya existe en la base de datos
                          </p>
                          <span>¿Quiere asignar este tutor al alumno?</span>
                          <ButtonAction
                            onClick={(e) => addEmailData(e, setFieldValue)}
                          >
                            <PlusIcon className="h-5 w-5 text-black" />
                          </ButtonAction>
                        </>
                      )}
                    </div>
                  </div>
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
                      label="Teléfono"
                      type="text"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      maxLength={10}
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
                    {errors && (
                      <span className="text-red">{errors.avatar}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormTutor;
