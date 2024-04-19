"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { validateAuxiliar } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { createUsersByForm, updateUsersByForm } from "@/services/UsersServices";
import { useAuthContext } from "@/context/AuthContext";
import StepAuxiliar from "@/components/Forms/StepAuxiliar";
import { toast } from "sonner";
import { getAuxiliars } from "@/services/AuxiliarsServices";

const FormAuxiliar = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile, school } = useAuthContext();
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
        getAuxiliars();
        return toast.success(message);
      }
      setIsLoading(false);
      return toast.error(message);
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 animate-spin text-white"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 animate-spin text-black"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                ) : isEdit ? (
                  "Editar"
                ) : (
                  "Enviar"
                )}
              </Button>
            </div>
            <StepAuxiliar isEdit={isEdit} />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormAuxiliar;
