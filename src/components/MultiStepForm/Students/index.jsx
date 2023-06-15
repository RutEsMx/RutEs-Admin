import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import StepStudent from "@/components/Forms/StepStudent";
import StepParents from "@/components/Forms/StepParents";
import StepTutors from "@/components/Forms/StepTutors";
import { validateStudent, validateFather, validateMother, validateTutors } from "@/utils/validationSchemas";

const STEPS = [StepStudent]
const VALIDATE_SCHEMA = [validateStudent]


const MultiStepFormStudent = () => {
  const [step, setStep] = useState(0)
  const [steps, setSteps] = useState(STEPS);
  const [validationSchemas, setValidationSchemas] = useState(VALIDATE_SCHEMA);


  const initialValues = {
    firstName: 'Johan Gabriel',
    lastName: 'Blanco',
    secondLastName: '',
    birthDate: '',
    bloodType: '',
    allergies: '',
    grade: '',
    group: '',
    enrollment: 'asds',
    serviceType: 'complete',
    avatar: '',
    includeFather: false,
    includeMother: false,
    father: {
      firstName: 'Jonathan',
      lastName: 'Blanco',
      secondLastName: '',
      phone: '9933600042',
      email: 'jblancoh26@gmail.com',
      avatar: '',
    },
    mother: {
      firstName: '',
      lastName: '',
      secondLastName: '',
      phone: '',
      email: '',
      avatar: '',
    },
    countTutors: 0,
    // tutors: [],
  };
  
  const handleNext = (values, { setSubmitting, setFieldValue, validateField }) => {
    let newSteps = [...steps];
    let newValidationSchema = [...validationSchemas];
    
    
    if (step === 0) {
      newSteps = [STEPS[0]];
      newValidationSchema = [VALIDATE_SCHEMA[0]];

      if (values?.includeFather) {
        newSteps.push(StepParents)
        newValidationSchema.push(validateFather)
      }

      if (values?.includeMother) {
        newSteps.push(StepParents)
        newValidationSchema.push(validateMother)
      }
      
      for (let index = 0; index < values?.countTutors; index++) {
        newSteps.push(StepTutors)
        newValidationSchema.push(validateTutors(index))
        // setFieldValue(`tutors[${index}].firstName`, '')
        // setFieldValue(`tutors[${index}].lastName`, '')
        // setFieldValue(`tutors[${index}].secondLastName`, '')
        // setFieldValue(`tutors[${index}].phone`, '')
        // setFieldValue(`tutors[${index}].email`, '')
        // setFieldValue(`tutors[${index}].avatar`, '')
        // setFieldValue(`tutors[${index}].active`, false)
      }

      setSteps(newSteps);
      setValidationSchemas(newValidationSchema);
    }

    setSubmitting(false)

    if (step + 1 < newSteps.length) {
      setStep(step + 1)
    } else {
      console.log('Enviar formulario')
    }
  }
  const handleBack = () => {
    setStep(step - 1)
    if(step === 1) {
      setSteps([STEPS[0]])
      setValidationSchemas([VALIDATE_SCHEMA[0]])
    }
    
  }
  
  const CurrentStep = steps[step]
  const CurrentValidateSchema = validationSchemas[step]
  
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleNext}
      validationSchema={CurrentValidateSchema}
    >
      {({ isSubmitting}) => (
        <Form>
          <CurrentStep validation={validationSchemas[step]} steps={steps} step={step}/>
          <button type="button" onClick={handleBack} disabled={step === 0}>
            Atrás
          </button>
          <button type="submit" disabled={isSubmitting}>
            {step === steps.length - 1 ? 'Enviar' : 'Siguiente'}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default MultiStepFormStudent;