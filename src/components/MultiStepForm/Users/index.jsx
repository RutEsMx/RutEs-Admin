'use client'
import { Formik, Form } from "formik";
import { useRouter } from 'next/navigation'
import StepUsers from "@/components/Forms/StepUsers";
import { validateUsers } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { createUsersByForm } from "@/services/UsersServices";


const FormUser = () => {
  const navigation = useRouter()

  const initialValues = {
    name: '',
    lastName: '',
    secondLastName: '',
    roles: [],
    email: '',
    phone: '',
  };

  const handleNext = async (values, { setSubmitting, setFieldValue, validateField }) => {
    const { success, message } = await createUsersByForm(values)
    if(success) {
      return navigation.replace('/dashboard/admin')
    }
    return alert(message)
  }
  const handleBack = () => {
    return navigation.replace('/dashboard/admin')
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleNext}
      validationSchema={validateUsers}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form>
          <div className="flex justify-end gap-4">
            <Button
              onClick={handleBack}
              color="bg-light-gray"
              type="button"
            >
              Atrás
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="button"
            >
              Enviar
            </Button>
          </div>
          <StepUsers />
        </Form>
      )}
    </Formik>
  );
}

export default FormUser;