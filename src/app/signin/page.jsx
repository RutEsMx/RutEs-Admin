/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ButtonStep from "@/components/Button";
import InputField from "@/components/InputField";
import { Formik, Form } from "formik";
import Link from "next/link";
import { signIn } from "@/services/AuthServices";
import { validationLogin } from "@/utils/validationSchemas";
import { useAuthContext } from "@/context/AuthContext";

export default function Page() {
  const router = useRouter();
  const { setLoading } = useAuthContext();

  const initialValues = {
    email: "",
    password: "",
  };

  const handleForm = async (event) => {
    const { email, password } = event;
    setLoading(true);
    try {
      await signIn(email, password);
      return router.push("/dashboard/routes");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="text-black container h-screen mx-auto">
      {/* Center grid  */}
      <div className="grid grid-cols-2 h-full">
        {/* Left grid  */}
        <div className="col-span-1 bg-gray-100">
          <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col justify-center items-center">
              <img src="/rutes_logo.png" alt="Rutes" className="w-36 h-full" />
            </div>
          </div>
        </div>
        {/* Right grid  */}
        <div className="col-span-1 bg-gray-50 ">
          <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col justify-center items-center border-2 border-gray py-4 w-full rounded-lg">
              <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
              <Formik
                initialValues={initialValues}
                onSubmit={handleForm}
                validationSchema={validationLogin}
                validateOnBlur={false}
                validateOnMount={false}
                validateOnChange={false}
              >
                {({ values, handleChange, errors, setValues }) => (
                  <Form className="flex flex-col justify-center items-center w-full">
                    <AutofillSync values={values} setValues={setValues} />
                    <div className="p-4 w-3/5">
                      <InputField
                        label="Correo electrónico"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email}
                        autoComplete="username"
                      />
                    </div>
                    <div className="p-4 w-3/5">
                      <InputField
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        error={errors.password}
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="p-4 text-white font-bold w-3/5">
                      <ButtonStep type="submit" className="w-full text-2xl">
                        INGRESAR
                      </ButtonStep>
                    </div>
                    <div>
                      <Link href="/fortgot-password">
                        <span className="text-gray">
                          Olvidaste tu contraseña?
                        </span>
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AutofillSync = ({ values, setValues }) => {
  useEffect(() => {
    if (
      document.querySelector('input[name="email"]')?.value ||
      document.querySelector('input[name="password"]')?.value
    ) {
      if (!values.email || !values.password) {
        setValues({
          email: document.querySelector('input[name="email"]')?.value || "",
          password:
            document.querySelector('input[name="password"]')?.value || "",
        });
      }
    }
  }, []);
  return null;
};
