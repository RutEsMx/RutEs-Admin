"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { validateAuxiliar } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { createUsersByForm, updateUsersByForm } from "@/services/UsersServices";
import { useAuthContext } from "@/context/AuthContext";
import StepAuxiliar from "@/components/Forms/StepAuxiliar";
import Alert from "@/components/Alert";

const FormAuxiliar = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile } = useAuthContext();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const initialValues = {
    name: data?.name || "",
    lastName: data?.lastName || "",
    secondLastName: data?.secondLastName || "",
    email: data?.email || "",
    phone: data?.phone || "",
    adminNumber: data?.adminNumber || "",
    roles: ["auxiliar"],
    isEdit,
  };

  const handleNext = async (values) => {
    try {
      values.schoolId = profile?.schoolId;
      if (isEdit) values.id = data?.id;
      const { success, message, error } = isEdit
        ? await updateUsersByForm(values)
        : await createUsersByForm(values);

      if (error) return alert(error?.message);
      if (success) {
        return setMessage(message);
        // return navigation.replace("/dashboard/auxiliars");
      }
      return setMessage(message);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBack = () => {
    return navigation.replace("/dashboard/auxiliars");
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleNext}
        validationSchema={validateAuxiliar}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {({ isSubmitting, handleSubmit }) => (
          <Form>
            <div className="flex justify-end gap-4 -mt-8">
              <Button onClick={handleBack} color="bg-light-gray" type="button">
                Atrás
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                type="button"
              >
                {isEdit ? "Editar" : "Enviar"}
              </Button>
            </div>
            <div className="mt-4">
              <Alert
                isOpen={!!message || !!error}
                message={message || error}
                type={message ? "success" : "error"}
              />
            </div>
            <StepAuxiliar isEdit={isEdit} />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormAuxiliar;
