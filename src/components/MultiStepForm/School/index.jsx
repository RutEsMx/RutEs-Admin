"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { validateSchool } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import {
  createSchoolByForm,
  updateSchoolByForm,
} from "@/services/SchoolServices";
import StepSchool from "@/components/Forms/StepSchool";
import { useAuthContext } from "@/context/AuthContext";
import Alert from "@/components/Alert";

const FormSchool = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { setSchool } = useAuthContext();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const initialValues = {
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    address: data?.address || "",
    clave: data?.clave || "",
    postalCode: data?.postalCode || "",
    coords: data?.coords || {},
  };

  const handleNext = async (values) => {
    values.id = data?.id;
    const { success, message, error, result } = isEdit
      ? await updateSchoolByForm(values)
      : await createSchoolByForm(values);
    if (error) return setError(error?.message);

    if (success) {
      setSchool(result);
      setMessage(message);
      return navigation.replace("/dashboard/admin/schools");
    }
    return setMessage(message);
  };

  const handleBack = () => {
    return navigation.replace("/dashboard/admin/schools");
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleNext}
      validationSchema={validateSchool}
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
          <StepSchool />
        </Form>
      )}
    </Formik>
  );
};

export default FormSchool;
