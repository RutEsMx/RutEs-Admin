import { useRouter } from "next/navigation";
import Image from "next/image";
import ButtonStep from "@/components/Button";


export default function School() {
  const navigation = useRouter()
  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <h1 className="font-bold text-3xl">Escuela</h1>
        </div>
        <div className=" grid-start-2 me-5">
          <div className="flex justify-end gap-2">
            <ButtonStep
              color="bg-light-gray"
              onClick={() => navigation.push('/dashboard/admin/school/edit/1')}
            >
              Editar
            </ButtonStep>
            <ButtonStep
              color="bg-yellow"
              onClick={() => navigation.push('/dashboard/admin/school/create')}
            >
              Crear
            </ButtonStep>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3">
        <div className="flex flex-col">
          <label className="font-bold">Nombre:</label>
          <label className="font-bold">Clave:</label>
          <label className="font-bold">Correo:</label>
          <label className="font-bold">Telefono:</label>
          <label className="font-bold">Dirección:</label>
          <label className="font-bold">Estado:</label>
          <label className="font-bold">Municipio:</label>
          <label className="font-bold">Localidad:</label>
          <label className="font-bold">Código Postal:</label>
        </div>
        <div>
          <p>Escuela 1</p>
          <p>123456</p>
          <p>
            <a href={`mailto:`} className="text-blue-500">
              Correo
            </a>
          </p>
          <p>1234567890</p>
          <p>Dirección 1</p>
          <p>Estado 1</p>
          <p>Municipio 1</p>
          <p>Localidad 1</p>
          <p>12345</p>
        </div>
        <div>
          <p>Logo: </p>
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </div>
      </div>
    </>
  )
}