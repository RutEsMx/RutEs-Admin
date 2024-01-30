"use client";
import { useEffect, useState } from "react";
import { getStudentById } from "@/services/StudentsServices";
import { OPTIONS_TYPE_SERVICES } from "@/utils/options";
import Image from "next/image";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { setAlert, useSystemStore } from "@/store/useSystemStore";
import ButtonLink from "@/components/ButtonLink";
import { useStudentsStore } from "@/store/useStudentsStore";
import useTutorsByStudents from "@/hooks/useTutorsByStudents";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import Alert from "@/components/Alert";
const storage = getStorage();

const Page = ({ params }) => {
  const { student, updateStudent } = useStudentsStore();
  const { tutors } = useTutorsByStudents(student);
  const [imageUrl, setImageUrl] = useState("");
  const [isClient, setIsClient] = useState(false);
  const { alert } = useSystemStore();

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
    setIsClient(true);
    getStudent();
  }, []);

  const handleStatus = async (tutorId) => {
    const status = student?.tutorActive === tutorId ? "" : tutorId;
    const updateTutorActive = await updateDoc(doc(db, "students", params.id), {
      tutorActive: status,
    });
    const updateStudentGlobal = await updateStudent({
      ...student,
      tutorActive: status,
    });

    Promise.all([updateTutorActive, updateStudentGlobal])
      .then(() => {
        setAlert({
          type: "success",
          message: "Tutor actualizado correctamente",
          isOpen: true,
        });
        setTimeout(() => {
          setAlert({
            type: "",
            message: "",
            isOpen: false,
          });
        }, 3000);
      })
      .catch((error) => {
        setAlert({
          type: "error",
          message: error?.message,
          isOpen: true,
        });
      });
  };

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
                <span className="">{isClient && student?.name}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Apellido Materno:</span>
                <span className="">{isClient && student?.secondLastName}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Grado:</span>
                <span className="">{isClient && student?.grade}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Tipo de servicio:</span>
                <span className="">{isClient && typeService}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Estado de servicio:</span>
                <span className="">
                  {isClient && student?.status === "active"
                    ? "Activo"
                    : "Inactivo"}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-around">
              <div className="flex flex-row gap-2">
                <span className="font-bold">Apellido Paterno:</span>
                <span className="">{isClient && student?.lastName}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Grupo:</span>
                <span className="">{isClient && student?.group}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Grupo Sanguíneo:</span>
                <span className="">{isClient && student?.bloodType}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Matricula:</span>
                <span className="">{isClient && student?.enrollment}</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Alergias:</span>
                <span className="">{isClient && student?.allergies}</span>
              </div>
            </div>
          </div>
          <div>
            {imageUrl && (
              <Image src={imageUrl} alt="avatar" width={200} height={200} />
            )}
          </div>
        </div>
        <div className="my-3">
          <div className="grid grid-flow-row md:grid-cols-5 gap-4">
            <div className="col-span-5 flex justify-between">
              <h2 className="font-bold text-2xl">Tutores:</h2>
              <ButtonLink href={`/dashboard/students/${params.id}/tutors`}>
                Agregar tutor
              </ButtonLink>
            </div>

            {tutors &&
              tutors?.map((tutor) => (
                <div
                  className={`card shadow-xl ${
                    student?.tutorActive === tutor?.id
                      ? "bg-yellow hover:bg-yellow/80"
                      : "bg-slate-200 hover:bg-slate-200/80"
                  } cursor-pointer`}
                  key={tutor?.id}
                  onClick={() => handleStatus(tutor?.id)}
                >
                  <div className="card-body">
                    <h2 className="card-title text-wrap">
                      {`${tutor?.name || ""} ${tutor?.lastName || ""} ${
                        tutor?.secondLastName || ""
                      }`}
                    </h2>
                    <label className="cursor-pointer">
                      {student?.tutorActive === tutor?.id
                        ? "Tutor activo"
                        : "Tutor inactivo"}
                    </label>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Alert
          isOpen={alert.isOpen}
          message={alert.message}
          type={alert.type}
        />
      </div>
    </div>
  );
};

export default Page;
