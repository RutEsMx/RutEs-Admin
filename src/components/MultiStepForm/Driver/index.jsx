"use client";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { validateDriver } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";
import StepDriver from "@/components/Forms/StepDriver";
import {
  createDriverByForm,
  getDrivers,
  updateDriverByForm,
} from "@/services/DriverServices";
import { toast } from "sonner";

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
    avatar: data?.avatar || "",
    route: data?.route || null,
  };

  const handleNext = async (values) => {
    try {
      values.schoolId = profile?.schoolId;
      if (isEdit) values.id = data?.id;
      const { success, message, error } = isEdit
        ? await updateDriverByForm(values)
        : await createDriverByForm(values);

      if (error) throw new Error(error);
      if (success) {
        toast.success(message);
        getDrivers();
        return navigation.replace("/dashboard/drivers");
      }
      return toast.success(message);
    } catch (error) {
      toast.error(error?.message || "Ocurrió un error, intenta de nuevo");
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
              {isEdit ? "Guardar" : "Enviar"}
            </Button>
          </div>
          <StepDriver isEdit={isEdit} />
        </Form>
      )}
    </Formik>
  );
};

export default FormDriver;
