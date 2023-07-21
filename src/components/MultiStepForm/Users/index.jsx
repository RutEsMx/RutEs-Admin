"use client";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import StepUsers from "@/components/Forms/StepUsers";
import { validateUsers, validateUpdateUsers } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { createUsersByForm, updateUsersByForm } from "@/services/UsersServices";
import { useAuthContext } from "@/context/AuthContext";

const FormUser = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile } = useAuthContext();

  const initialValues = {
    name: data?.name || "",
    lastName: data?.lastName || "",
    secondLastName: data?.secondLastName || "",
    roles: data?.roles || [],
    email: data?.email || "",
    phone: data?.phone || "",
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
        alert(message);
        return navigation.replace("/dashboard/admin");
      }
      return alert(message);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBack = () => {
    return navigation.replace("/dashboard/admin");
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleNext}
      validationSchema={isEdit ? validateUpdateUsers : validateUsers}
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
          <StepUsers isEdit={isEdit} />
        </Form>
      )}
    </Formik>
  );
};

export default FormUser;
