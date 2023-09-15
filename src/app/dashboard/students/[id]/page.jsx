"use client";
import { useEffect, useState } from "react";
import { getStudentById } from "@/services/StudentsServices";
import { OPTIONS_TYPE_SERVICES } from "@/utils/options";
import Image from "next/image";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { setAlert } from "@/store/useSystemStore";
import ButtonLink from "@/components/ButtonLink";
import { useStudentsStore } from "@/store/useStudentsStore";

const storage = getStorage();

const Page = ({ params }) => {
  const { student } = useStudentsStore();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const getStudent = async () => {
      const student = await getStudentById(params.id);

      if (student?.avatar) {
        const fileRef = ref(storage, student?.avatar);
        getDownloadURL(fileRef)
          .then((url) => {
            setImageUrl(url);
          })
          .catch((error) => {
            setAlert({
              type: "error",
              message: error?.message,
              isOpen: true,
            });
          });
      }
    };
    getStudent();
  }, []);

  const typeService = OPTIONS_TYPE_SERVICES.find(
    (option) => option.value === student?.serviceType,
  )?.label;

  return (
    <div className="container mx-auto px-4 pb-12 h-screen  pt-10">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h1 className="font-bold text-3xl">Datos del alumno</h1>
        </div>
        <div className="flex justify-end gap-2">
          <ButtonLink color="bg-yellow" href={"/dashboard/students"}>
            Atras
          </ButtonLink>
          <ButtonLink
            color="bg-light-gray"
            href={`/dashboard/students/edit/${params.id}`}
          >
            Editar
          </ButtonLink>
        </div>
      </div>
      <div className="border border-black px-4 py-2 mt-4">
        <div className="grid grid-cols-3">
          <div className="col-span-2 grid grid-cols-2">
            <div className="flex flex-col justify-around">
              <div className="flex flex-row gap-2">
                <span className="font-bold">Nombre:</span>
                <span className="">{student?.name}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Apellido Materno:</span>
                <span className="">{student?.secondLastName}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Grado:</span>
                <span className="">{student?.grade}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Tipo de servicio:</span>
                <span className="">{typeService}</span>
              </div>
            </div>
            <div className="flex flex-col justify-around">
              <div className="flex flex-row gap-2">
                <span className="font-bold">Apellido Paterno:</span>
                <span className="">{student?.lastName}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Grupo:</span>
                <span className="">{student?.group}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Grupo Sanguíneo:</span>
                <span className="">{student?.bloodType}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Matricula:</span>
                <span className="">{student?.enrollment}</span>
              </div>
            </div>
          </div>
          <div>
            <Image
              src={imageUrl}
              alt="avatar"
              width={200}
              height={200}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
