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
import { setAlert, useSystemStore } from "@/store/useSystemStore";
import { toast } from "sonner";

const FormAuxiliar = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile, school } = useAuthContext();
  const { alert } = useSystemStore();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: data?.name || "",
    lastName: data?.lastName || "",
    secondLastName: data?.secondLastName || "",
    email: data?.email || "",
    phone: data?.phone || "",
    adminNumber: data?.adminNumber || "",
    roles: ["auxiliar"],
    isEdit,
    avatar: data?.avatar || "",
    password: null,
    confirmPassword: null,
    route: data?.route || null,
  };

  const handleNext = async (values) => {
    setIsLoading(true);
    try {
      values.schoolId = profile?.schoolId;
      values.schoolName = school?.name;
      if (isEdit) values.id = data?.id;
      const { success, message, error } = isEdit
        ? await updateUsersByForm(values)
        : await createUsersByForm(values);

      if (error) {
        setIsLoading(false);
        toast.error(error?.message);
      }
      if (success) {
        setIsLoading(false);
        navigation.replace("/dashboard/auxiliars");
        return toast.success(message);
      }
      setIsLoading(false);
      return setAlert({
        type: "warning",
        message: message,
        isOpen: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.message);
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
                ) : isEdit ? (
                  "Editar"
                ) : (
                  "Enviar"
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
            <StepAuxiliar isEdit={isEdit} />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormAuxiliar;
