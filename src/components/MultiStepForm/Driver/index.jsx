"use client";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { validateDriver } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";
import StepDriver from "@/components/Forms/StepDriver";
import {
  createDriverByForm,
  updateDriverByForm,
} from "@/services/DriverServices";

const FormDriver = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile } = useAuthContext();

  const initialValues = {
    name: data?.name || "",
    lastName: data?.lastName || "",
    secondLastName: data?.secondLastName || "",
    phone: data?.phone || "",
    adminNumber: data?.adminNumber || "",
    license: data?.license || "",
  };

  const handleNext = async (values) => {
    try {
      values.schoolId = profile?.schoolId;
      if (isEdit) values.id = data?.id;
      const { success, message, error } = isEdit
        ? await updateDriverByForm(values)
        : await createDriverByForm(values);

      if (error) return alert(error?.message);
      if (success) {
        alert(message);
        return navigation.replace("/dashboard/drivers");
      }
      return alert(message);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBack = () => {
    return navigation.replace("/dashboard/drivers");
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleNext}
      validationSchema={validateDriver}
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
          <StepDriver isEdit={isEdit} />
        </Form>
      )}
    </Formik>
  );
};

export default FormDriver;
