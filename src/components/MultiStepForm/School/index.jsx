'use client'
import { Formik, Form } from "formik";
import { useRouter } from 'next/navigation'
import { validateSchool } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { createSchoolByForm } from "@/services/SchoolServices";
import StepSchool from "@/components/Forms/StepSchool";


const FormSchool = () => {
  const navigation = useRouter()

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    coords: {},
  };

  const handleNext = async (values, { setSubmitting, setFieldValue, validateField }) => {
    const { success, message, error } = await createSchoolByForm(values)
    if (error) return alert(error?.message)
      
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
      validationSchema={validateSchool}
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
          <StepSchool />
        </Form>
      )}
    </Formik>
  );
}

export default FormSchool;