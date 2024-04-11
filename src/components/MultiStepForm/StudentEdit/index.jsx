"use client";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { validateStudentEdit } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";
import StepStudent from "@/components/Forms/StepStudent";
import { updateStudentByForm } from "@/services/StudentsServices";
import { toast } from "sonner";

const FormStudentEdit = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile } = useAuthContext();
  const initialValues = {
    name: data?.name,
    lastName: data?.lastName,
    secondLastName: data?.secondLastName,
    birthDate: data?.birthDate,
    bloodType: data?.bloodType,
    allergies: data?.allergies,
    grade: data?.grade,
    group: data?.group,
    enrollment: data?.enrollment,
    serviceType: data?.serviceType,
    avatar: data?.avatar,
    id: data?.id,
    status: data?.status,
  };

  const onSubmit = async (values) => {
    values.schoolId = profile?.schoolId;
    const { success, message, error } = await updateStudentByForm(values);
    if (error) return toast.error(message);
    if (success) {
      handleBack();
      return toast.success(message);
    }
  };

  const handleBack = () => {
    return navigation.back();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validateStudentEdit}
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
          <StepStudent isEdit={isEdit} />
        </Form>
      )}
    </Formik>
  );
};

export default FormStudentEdit;
