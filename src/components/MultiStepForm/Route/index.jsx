"use client";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { validateRoute } from "@/utils/validationSchemas";
import Button from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";
import StepRoute from "@/components/Forms/StepRoute";
import StepStops from "@/components/Forms/StepStops";
import {
  createRoutesByForm,
  updateRoutesByForm,
} from "@/services/RoutesServices";
import MapStops from "@/components/MapStops";
import StepStopsEdit from "@/components/Forms/StepStopsEdit";
import { useRoutesStore } from "@/store/useRoutesStore";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const FormRoute = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { profile } = useAuthContext() || {};
  const { setTypeTravel } = useRoutesStore();

  const initialValues = {
    name: data?.name || "",
    capacity: data?.capacity || "",
    unit: data?.unit || null,
    auxiliar: data?.auxiliar || null,
    driver: data?.driver || null,
    students: data?.students || [],
    routeId: data?.id || null,
    workshop: data?.workshop || false,
    temporalWorkshop: undefined,
    temporalToSchool: undefined,
    temporalToHome: undefined,
  };

  const handleNext = async (values) => {
    try {
      values.schoolId = profile?.schoolId;
      if (isEdit) values.id = data?.id;
      const { success, message, error } = isEdit
        ? await updateRoutesByForm(values)
        : await createRoutesByForm(values);
      if (error) {
        toast.error(error?.message);
      }
      if (success) {
        toast.success(message);
        navigation.back();
      }
      setTypeTravel("toHome");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (data?.workshop) {
      setTypeTravel("workshop");
    } else {
      setTypeTravel("toHome");
    }
  }, [data?.workshop, setTypeTravel]);

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
        validateOnChange={true}
        validateOnMount={false}
      >
        {({ isSubmitting, handleSubmit, values }) => (
          <Form>
            <div className="flex justify-end gap-4 -mt-8 mb-4">
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
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-2 border-2 border-gray rounded-lg p-4">
                <Tabs defaultValue="data">
                  <TabsList>
                    <TabsTrigger value="data">DATOS</TabsTrigger>
                    <TabsTrigger value="stops">PARADAS</TabsTrigger>
                  </TabsList>
                  <TabsContent value="data">
                    <StepRoute isEdit={isEdit} />
                  </TabsContent>
                  <TabsContent value="stops">
                    {isEdit ? (
                      <StepStopsEdit name={values?.name} />
                    ) : (
                      <StepStops name={values?.name} />
                    )}
                  </TabsContent>
                </Tabs>
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
