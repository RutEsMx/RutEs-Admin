"use client";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { validateUnits } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";
import StepUnits from "@/components/Forms/StepUnits";
import { createUnitsByForm, updateUnitsByForm } from "@/services/UnitsServices";
import { toast } from "sonner";

const FormUnits = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile } = useAuthContext();

  const initialValues = {
    model: data?.model || "",
    year: data?.year || "",
    plate: data?.plate || "",
    adminNumber: data?.adminNumber || "",
    passengers: data?.passengers || "",
    route: data?.route || null,
    lastStatus: data?.lastStatus || "",
  };

  const onSubmit = async (values) => {
    values.schoolId = profile?.schoolId;
    if (isEdit) values.id = data?.id;
    const { success, message, error } = isEdit
      ? await updateUnitsByForm(values)
      : await createUnitsByForm(values);

    if (error) return toast.error(error?.message);
    if (success) {
      toast.success(message);
      return handleBack();
    }
  };

  const handleBack = () => {
    return navigation.replace("/dashboard/units");
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validateUnits}
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
              {isEdit ? "Guardar" : "Agregar"}
            </Button>
          </div>
          <StepUnits isEdit={isEdit} />
        </Form>
      )}
    </Formik>
  );
};

export default FormUnits;
