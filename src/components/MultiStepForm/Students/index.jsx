"use client";
import React, { useState } from "react";
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
import {
  generateFatherMock,
  generateMotherMock,
  generateStudentMock,
} from "@/mocks/createStudent";
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

  const isDev = process.env.NODE_ENV === "development";

  // Use state instead of useMemo to prevent random data generation during SSR
  // causing hydration mismatches and infinite loops with Radix UI components.
  const [initialValues, setInitialValues] = useState(null);

  React.useEffect(() => {
    const studentMock = isDev ? generateStudentMock() : {};
    const fatherMock = isDev ? generateFatherMock() : {};
    const motherMock = isDev ? generateMotherMock() : {};

    setInitialValues({
      name: studentMock.name || "",
      lastName: studentMock.lastName || "",
      secondLastName: studentMock.secondLastName || "",
      birthDate: studentMock.birthDate || "",
      bloodType: studentMock.bloodType || "",
      allergies: studentMock.allergies || "",
      grade: studentMock.grade || "",
      group: studentMock.group || "",
      enrollment: studentMock.enrollment || "",
      serviceType: studentMock.serviceType || "",
      avatar: "",
      includeFather: studentMock.includeFather || false,
      includeMother: studentMock.includeMother || false,
      status: "active",
      father: {
        name: fatherMock.name || "",
        lastName: fatherMock.lastName || "",
        secondLastName: fatherMock.secondLastName || "",
        phone: fatherMock.phone || "",
        email: fatherMock.email || "",
        avatar: "",
        emailExist: false,
      },
      mother: {
        name: motherMock.name || "",
        lastName: motherMock.lastName || "",
        secondLastName: motherMock.secondLastName || "",
        phone: motherMock.phone || "",
        email: motherMock.email || "",
        avatar: "",
        emailExist: false,
      },
      countTutors: 0,
      address: {
        street: studentMock.address?.street || "",
        number: studentMock.address?.number || "",
        interiorNumber: studentMock.address?.interiorNumber || "",
        neighborhood: studentMock.address?.neighborhood || "",
        postalCode: studentMock.address?.postalCode || "",
        city: studentMock.address?.city || "",
        state: studentMock.address?.state || "",
      },
    });
  }, [isDev]);

  if (!initialValues) {
    return (
      <div className="flex justify-center items-center h-full mt-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-10 h-10 animate-spin text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>
    );
  }

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
