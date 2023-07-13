'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/firebase/auth"
import ButtonStep from "@/components/Button"
import InputField from "@/components/InputField"
import { Formik, Form } from "formik";
import Image from "next/image"
import Link from "next/link"

const initialValues = {
  email: '',
  password: '',
}

export default function Page () {
  const router = useRouter()
  
  const handleForm = async (event) => {
    const { email, password } = event;
    console.log("🚀 ~ file: page.jsx:21 ~ handleForm ~ email, password:", email, password)
    try {
      const { result, error } = await signIn(email, password);
      
      if (error) {
        return alert(error.message)
      }
      if (result) {
        return router.push("/dashboard")
      }
      
    } catch (error) {
      alert(error.message)
    }
  }
  
  return (
    <div className="text-black container h-screen mx-auto">
    {/* Center grid  */}
      <div className="grid grid-cols-2 h-full">
        {/* Left grid  */}
        <div className="col-span-1 bg-gray-100">
          <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col justify-center items-center">
              <Image src="/rutes_logo.png" width={550} height={550} priority />
            </div>
          </div>
        </div>
        {/* Right grid  */}
        <div className="col-span-1 bg-gray-50 ">
          <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col justify-center items-center border-2 border-gray py-4 w-full rounded-lg">
              <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
              <Formik initialValues={initialValues} onSubmit={handleForm}>
                {({ values, handleChange, errors }) => (
                  <Form className="flex flex-col justify-center items-center w-full">
                    {console.log("🚀 ~ file: page.jsx:56 ~ Page ~ values:", values)}
                    <div className="p-4 w-3/5">
                      <InputField
                        label="Correo electrónico"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email}
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
                      />
                    </div>
                    <div className="p-4 text-white font-bold w-3/5">
                      <ButtonStep
                        type="submit"
                        className="w-full text-2xl"
                      >
                        INGRESAR
                      </ButtonStep>
                    </div>
                    <div>
                      <Link href="/fortgot-password">
                        <span className="text-gray">Olvidaste tu contraseña?</span>
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
  )
}