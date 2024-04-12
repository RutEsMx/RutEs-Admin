"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import { setAlert, useSystemStore } from "@/store/useSystemStore";
import InputField from "@/components/InputField";
import FileInput from "@/components/FileInput";
import { updateParentProfile } from "@/services/StudentsServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FormParent = ({ data, isEdit = false }) => {
  const navigation = useRouter();
  const { alert } = useSystemStore();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: data?.name || "",
    lastName: data?.lastName || "",
    secondLastName: data?.secondLastName || "",
    email: data?.email || "",
    phone: data?.phone || "",
    isEdit,
    avatar: data?.avatar || "",
    route: data?.route || null,
  };

  const handleNext = async (values) => {
    setIsLoading(true);
    try {
      values.id = data?.id;
      const response = await updateParentProfile(values);

      setIsLoading(false);

      if (response?.error) {
        return setAlert({
          type: "error",
          message: "Ocurrió un error al actualizar el perfil",
          isOpen: true,
        });
      }

      setAlert({
        type: "success",
        message: "Perfil actualizado correctamente",
        isOpen: true,
      });
      navigation.replace("/dashboard/parents");
      return setAlert({
        isOpen: false,
      });
    } catch (error) {
      setIsLoading(false);
      setAlert({
        type: "error",
        message: error?.message,
        isOpen: true,
      });
    }
  };

  const handleBack = () => {
    return navigation.replace("/dashboard/parents");
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleNext}
        // validationSchema={validate}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {({
          isSubmitting,
          handleSubmit,
          values,
          handleChange,
          errors,
          setFieldValue,
        }) => (
          <Form>
            <div className="flex justify-end gap-4 -mt-8">
              <Button onClick={handleBack} color="bg-light-gray" type="button">
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
                disabled={isSubmitting}
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
                ) : (
                  "Editar"
                )}
              </Button>
            </div>
            <div className="mt-4">
              <Alert
                isOpen={alert.isOpen}
                message={alert.message}
                type={alert.type}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-2xl font-bold">Editar</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 p-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <InputField
                        label="Nombre(s)"
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        error={errors.name}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Apellido Paterno"
                        type="text"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                      />
                      <InputField
                        label="Apellido Materno"
                        type="text"
                        name="secondLastName"
                        value={values.secondLastName}
                        onChange={handleChange}
                      />
                      <InputField
                        label="Correo electrónico"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email}
                        disabled={isEdit}
                      />
                      <InputField
                        label="Teléfono"
                        type="text"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        maxLength={10}
                      />

                      {/* <InputField
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        error={errors.password}
                        autoComplete="off"
                      />
                      <InputField
                        label="Confirmar contraseña"
                        type="password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        autoComplete="off"
                      /> */}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col">
                      <FileInput
                        label="Avatar"
                        name="avatar"
                        value={values.avatar}
                        onChange={(event) => {
                          setFieldValue("avatar", event.currentTarget.files[0]);
                        }}
                        error={errors.avatar}
                      />
                      {errors && (
                        <span className="text-red-500">{errors.avatar}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormParent;
