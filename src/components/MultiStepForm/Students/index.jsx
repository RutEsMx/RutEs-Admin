"use client";
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
import { createParentsByForm, getStudents } from "@/services/StudentsServices";
import { useAuthContext } from "@/context/AuthContext";
import { fatherMock, motherMock, studentMock } from "@/mocks/createStudent";
import { toast } from "sonner";

const STEPS = [StepStudent];
const VALIDATE_SCHEMA = [validateStudent];

const MultiStepFormStudent = () => {
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState(STEPS);
  const [isLoading, setIsLoading] = useState(false);
  const [validationSchemas, setValidationSchemas] = useState(VALIDATE_SCHEMA);
  const navigation = useRouter();
  const { profile, school } = useAuthContext();

  const initialValues = {
    name: process.env.NODE_ENV === "development" ? studentMock.name : "",
    lastName:
      process.env.NODE_ENV === "development" ? studentMock.lastName : "",
    secondLastName:
      process.env.NODE_ENV === "development" ? studentMock.secondLastName : "",
    birthDate:
      process.env.NODE_ENV === "development" ? studentMock.birthDate : "",
    bloodType:
      process.env.NODE_ENV === "development" ? studentMock.bloodType : "",
    allergies: "",
    grade: process.env.NODE_ENV === "development" ? studentMock.grade : "",
    group: process.env.NODE_ENV === "development" ? studentMock.group : "",
    enrollment:
      process.env.NODE_ENV === "development" ? studentMock.enrollment : "",
    serviceType:
      process.env.NODE_ENV === "development" ? studentMock.serviceType : "",
    avatar: "",
    includeFather:
      process.env.NODE_ENV === "development"
        ? studentMock.includeFather
        : false,
    includeMother:
      process.env.NODE_ENV === "development"
        ? studentMock.includeMother
        : false,
    status: "active",
    father: {
      name: process.env.NODE_ENV === "development" ? fatherMock.name : "",
      lastName:
        process.env.NODE_ENV === "development" ? fatherMock.lastName : "",
      secondLastName:
        process.env.NODE_ENV === "development" ? fatherMock.secondLastName : "",
      phone: process.env.NODE_ENV === "development" ? fatherMock.phone : "",
      email: process.env.NODE_ENV === "development" ? fatherMock.email : "",
      avatar: "",
      emailExist: false,
    },
    mother: {
      name: process.env.NODE_ENV === "development" ? motherMock.name : "",
      lastName:
        process.env.NODE_ENV === "development" ? motherMock.lastName : "",
      secondLastName:
        process.env.NODE_ENV === "development" ? motherMock.secondLastName : "",
      phone: process.env.NODE_ENV === "development" ? motherMock.phone : "",
      email: process.env.NODE_ENV === "development" ? motherMock.email : "",
      avatar: "",
      emailExist: false,
    },
    countTutors: process.env.NODE_ENV === "development" ? 0 : 0,
    address: {
      street:
        process.env.NODE_ENV === "development"
          ? studentMock?.address?.street
          : "",
      number:
        process.env.NODE_ENV === "development"
          ? studentMock?.address?.number
          : "",
      neighborhood:
        process.env.NODE_ENV === "development"
          ? studentMock?.address?.neighborhood
          : "",
      postalCode:
        process.env.NODE_ENV === "development"
          ? studentMock?.address?.postalCode
          : "",
      city:
        process.env.NODE_ENV === "development"
          ? studentMock?.address?.city
          : "",
      state:
        process.env.NODE_ENV === "development"
          ? studentMock?.address?.state
          : "",
    },
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
    } else {
      values.schoolName = school?.name;
      createParentsByForm(values, profile?.schoolId)
        .then((response) => {
          if (response?.success) {
            toast.success("Estudiante creado correctamente");
            getStudents();
            navigation.replace("/dashboard/students");
            return;
          }
        })
        .catch((error) => {
          toast.error(
            error?.message || "Ocurrió un error al crear el estudiante",
          );
        })
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
              disabled={isSubmitting || isLoading}
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
              ) : step !== steps.length - 1 || step === 0 ? (
                "Siguiente"
              ) : (
                "Enviar"
              )}
            </Button>
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
