import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import StepStudent from "@/components/Forms/StepStudent";
import StepParents from "@/components/Forms/StepParents";
import StepTutors from "@/components/Forms/StepTutors";
import {
  validateStudent,
  validateFather,
  validateMother,
  validateTutors,
} from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { createParentsByForm } from "@/services/StudentsServices";
import { useAuthContext } from "@/context/AuthContext";
import { setAlert, useSystemStore } from "@/store/useSystemStore";
import Alert from "@/components/Alert";

const STEPS = [StepStudent];
const VALIDATE_SCHEMA = [validateStudent];

const MultiStepFormStudent = () => {
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState(STEPS);
  const [isLoading, setIsLoading] = useState(false);
  const [validationSchemas, setValidationSchemas] = useState(VALIDATE_SCHEMA);
  const navigation = useRouter();
  const { profile } = useAuthContext();
  const { alert } = useSystemStore();

  const initialValues = {
    name: "",
    lastName: "",
    secondLastName: "",
    birthDate: "",
    bloodType: "",
    allergies: "",
    grade: "",
    group: "",
    enrollment: "",
    serviceType: "",
    avatar: "",
    includeFather: false,
    includeMother: false,
    father: {
      name: "",
      lastName: "",
      secondLastName: "",
      phone: "",
      email: "",
      avatar: "",
      emailExist: false,
    },
    mother: {
      name: "",
      lastName: "",
      secondLastName: "",
      phone: "",
      email: "",
      avatar: "",
      emailExist: false,
    },
    countTutors: 0,
    // tutors: [],
  };

  const handleNext = async (values) => {
    setIsLoading(true);
    let newSteps = [...steps];
    let newValidationSchema = [...validationSchemas];

    if (step === 0) {
      newSteps = [STEPS[0]];
      newValidationSchema = [VALIDATE_SCHEMA[0]];

      if (values?.includeFather) {
        newSteps.push(StepParents);
        newValidationSchema.push(validateFather);
      }

      if (values?.includeMother) {
        newSteps.push(StepParents);
        newValidationSchema.push(validateMother);
      }

      for (let index = 0; index < values?.countTutors; index++) {
        newSteps.push(StepTutors);
        newValidationSchema.push(validateTutors(index));
      }

      setSteps(newSteps);
      setValidationSchemas(newValidationSchema);
    }

    if (step + 1 < newSteps.length) {
      setIsLoading(false);
      setStep(step + 1);
    } 
    else {
      createParentsByForm(values, profile?.schoolId)
        .then((response) => {
          if (response?.success) {
            setAlert({
              type: "success",
              message: "Se ha creado el estudiante correctamente",
              show: true,
            });
            navigation.replace("/dashboard/students");
            return setAlert({
              isOpen: false,
            });
          }
        })
        .catch((error) =>
          setAlert({
            type: "error",
            message:
              error?.message || "Ha ocurrido un error al crear el estudiante",
            show: true,
          }),
        )
        .finally(() => setIsLoading(false));
    }
  };
  const handleBack = () => {
    if (step === 0) return navigation.replace("/dashboard/students");
    setStep(step - 1);
    if (step === 1) {
      setSteps([STEPS[0]]);
      setValidationSchemas([VALIDATE_SCHEMA[0]]);
    }
  };

  const CurrentStep = steps[step];
  const CurrentValidateSchema = validationSchemas[step];

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleNext}
      validationSchema={CurrentValidateSchema}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form>
          <div className="flex justify-end gap-4 -mt-8">
            <Button
              onClick={handleBack}
              color="bg-light-gray"
              type="button"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                "Atrás"
              )}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
              type="button"
            >
              {isLoading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : step !== steps.length - 1 || step === 0 ? (
                "Siguiente"
              ) : (
                "Enviar"
              )}
            </Button>
          </div>
          <div className="mt-4">
            <Alert
              isOpen={alert?.show}
              message={alert?.message}
              type={alert?.type}
            />
          </div>
          <CurrentStep
            validation={validationSchemas[step]}
            steps={steps}
            step={step}
          />
        </Form>
      )}
    </Formik>
  );
};

export default MultiStepFormStudent;
