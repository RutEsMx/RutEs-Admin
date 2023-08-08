"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import StepUsers from "@/components/Forms/StepUsers";
import { validateUsers } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { createUsersByForm, updateUsersByForm } from "@/services/UsersServices";
import { useAuthContext } from "@/context/AuthContext";
import Alert from "@/components/Alert";

const FormUser = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile } = useAuthContext();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const initialValues = {
    name: data?.name || "",
    lastName: data?.lastName || "",
    secondLastName: data?.secondLastName || "",
    roles: data?.roles || [],
    email: data?.email || "",
    phone: data?.phone || "",
    isEdit,
  };

  const handleNext = async (values) => {
    try {
      values.schoolId = profile?.schoolId;
      if (isEdit) values.id = data?.id;
      const { success, message, error } = isEdit
        ? await updateUsersByForm(values)
        : await createUsersByForm(values);

      if (error) return setError(error?.message);
      if (success) {
        setMessage(message);
        return navigation.replace("/dashboard/admin/users");
      }
      return setMessage(message);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBack = () => {
    return navigation.replace("/dashboard/admin/users");
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleNext}
      validationSchema={validateUsers}
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
          <StepUsers isEdit={isEdit} />
        </Form>
      )}
    </Formik>
  );
};

export default FormUser;
