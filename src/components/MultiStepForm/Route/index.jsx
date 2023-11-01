"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { validateRoute } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";
import Alert from "@/components/Alert";
import StepRoute from "@/components/Forms/StepRoute";
import StepStops from "@/components/Forms/StepStops";
import {
  createRoutesByForm,
  updateRoutesByForm,
} from "@/services/RoutesServices";
import MapStops from "@/components/MapStops";
import { useSystemStore } from "@/store/useSystemStore";
import StepStopsEdit from "@/components/Forms/StepStopsEdit";

const FormRoute = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile } = useAuthContext() || {};
  const { alert } = useSystemStore();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("DATOS");

  const initialValues = {
    name: data?.name || "",
    capacity: data?.capacity || "",
    unit: data?.unit || null,
    auxiliar: data?.auxiliar || null,
    driver: data?.driver || null,
    students: data?.students || [],
    routeId: data?.id || null,
  };

  const handleNext = async (values) => {
    setError("");
    setMessage("");
    try {
      values.schoolId = profile?.schoolId;
      if (isEdit) values.id = data?.id;
      const { success, message, error } = isEdit
        ? await updateRoutesByForm(values)
        : await createRoutesByForm(values);
      if (error) {
        setError(error?.message);
      }
      if (success) {
        setMessage(message);
        setTimeout(() => {
          return navigation.back();
        }, 2000);
      }
      return setMessage(message);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBack = () => {
    return navigation.replace("/dashboard/routes");
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleNext}
        validationSchema={validateRoute}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {({ isSubmitting, handleSubmit }) => (
          <Form>
            <div className="flex justify-end gap-4 -mt-8">
              <Button onClick={handleBack} color="bg-light-gray" type="button">
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                type="button"
              >
                {isEdit ? "Guardar" : "Crear"}
              </Button>
            </div>
            <div className="my-4">
              <Alert
                isOpen={!!message || !!error || alert?.show}
                message={message || error || alert?.message}
                type={message ? "success" : "error" || alert?.type}
              />
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-2 border-2 border-gray rounded-lg p-4">
                <div className="tabs">
                  <a
                    className={`tab tab-bordered ${
                      activeTab === "DATOS" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("DATOS")}
                  >
                    DATOS
                  </a>
                  <a
                    className={`tab tab-bordered ${
                      activeTab === "PARADAS" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("PARADAS")}
                  >
                    PARADAS
                  </a>
                </div>
                <div className="divider mx-0 my-2 before:h-2 after:h-2"></div>
                {activeTab === "DATOS" ? (
                  <StepRoute />
                ) : isEdit ? (
                  <StepStopsEdit />
                ) : (
                  <StepStops />
                )}
              </div>
              <div className="col-span-3 border-2 border-gray rounded-lg p-4">
                <MapStops />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormRoute;
