"use client";
import { subscribeStudentById } from "@/services/StudentsServices";
import { DAYS, OPTIONS_TYPE_SERVICES, TYPE_TRAVEL } from "@/utils/options";
import Image from "next/image";
import ButtonLink from "@/components/ButtonLink";
import { useStudentsStore } from "@/store/useStudentsStore";
import useTutorsByStudents from "@/hooks/useTutorsByStudents";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRoutesStore } from "@/store/useRoutesStore";
import useStopsStudentDetails from "@/hooks/useStopsStudentDetails";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Skeleton from "@/components/ui/skeleton";

const Page = () => {
  const params = useParams();
  const { student, updateStudent, isLoading, setStudent } = useStudentsStore();
  const { routes } = useRoutesStore();
  const { tutors } = useTutorsByStudents(student);
  const { stops } = useStopsStudentDetails(student);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setStudent(null);
    const unsub = subscribeStudentById(params.id);
    setIsClient(true);
    return () => {
      unsub && unsub();
    };
  }, [params.id]);

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
        toast.success("Tutor actualizado correctamente");
      })
      .catch((error) => {
        toast.error(error?.message);
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
          <ButtonLink color="bg-primary" href={"/dashboard/students"}>
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
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-32 h-4" />
                  ) : (
                    student?.name
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Apellido Materno:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-32 h-4" />
                  ) : (
                    student?.secondLastName
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Grado:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-16 h-4" />
                  ) : (
                    student?.grade
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Tipo de servicio:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-24 h-4" />
                  ) : (
                    typeService
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Estado de servicio:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-20 h-4" />
                  ) : student?.status === "active" ? (
                    "Activo"
                  ) : (
                    "Inactivo"
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-around">
              <div className="flex flex-row gap-2">
                <span className="font-bold">Apellido Paterno:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-32 h-4" />
                  ) : (
                    student?.lastName
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Grupo:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-16 h-4" />
                  ) : (
                    student?.group
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Grupo Sanguíneo:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-12 h-4" />
                  ) : (
                    student?.bloodType
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Matricula:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-24 h-4" />
                  ) : (
                    student?.enrollment
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Alergias:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-32 h-4" />
                  ) : (
                    student?.allergies || "Sin dato"
                  )}
                </span>
              </div>
            </div>
            <div className="col-span-2 gap-2 grid grid-cols-2 py-4">
              <div className="col-span-2">
                <h3 className="font-bold text-2xl">Domicilio</h3>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Calle:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-40 h-4" />
                  ) : (
                    student?.address?.street
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Número exterior:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-16 h-4" />
                  ) : (
                    student?.address?.number
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Colonia:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-32 h-4" />
                  ) : (
                    student?.address?.neighborhood
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Número interior:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-16 h-4" />
                  ) : (
                    student?.address?.interiorNumber || "S/N"
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Ciudad:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-32 h-4" />
                  ) : (
                    student?.address?.city
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Estado:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-32 h-4" />
                  ) : (
                    student?.address?.state
                  )}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-bold">Codigo Postal:</span>
                <span className="">
                  {isLoading || !student ? (
                    <Skeleton className="w-20 h-4" />
                  ) : (
                    student?.address?.postalCode
                  )}
                </span>
              </div>
            </div>
          </div>
          <div>
            {isLoading || !student ? (
              <Skeleton className="w-[200px] h-[200px]" />
            ) : (
              student?.avatar && (
                <Image
                  src={student?.avatar}
                  alt="avatar"
                  width={200}
                  height={200}
                />
              )
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
            <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-4 col-span-5">
              {isLoading || !student ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))
              ) : tutors && tutors.length > 0 ? (
                tutors.map((tutor) => (
                  <Card className="cursor-pointer col-span-1" key={tutor?.id}>
                    <CardContent className="p-0">
                      <div
                        className={`
                        ${
                          student?.tutorActive === tutor?.id
                            ? "bg-primary hover:bg-primary/80 text-white"
                            : "bg-slate-200 hover:bg-slate-200/80"
                        } cursor-pointer p-4 rounded-md`}
                        onClick={() => handleStatus(tutor?.id)}
                      >
                        <div className="flex items-center gap-2 flex-col ">
                          <Label className="cursor-pointer">
                            {`${tutor?.name || ""} ${tutor?.lastName || ""} ${
                              tutor?.secondLastName || ""
                            }`}
                          </Label>
                          <Label className="cursor-pointer text-xs opacity-80">
                            {student?.tutorActive === tutor?.id
                              ? "Tutor activo"
                              : "Tutor inactivo"}
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="col-span-5 text-gray-500">
                  No hay tutores asignados
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 gap-2 grid grid-cols-3 py-4">
          <div className="col-span-3">
            <h3 className="font-bold text-2xl">Rutas y paradas</h3>
          </div>
          {isLoading || !student ? (
            <div className="col-span-3 grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="card" className="col-span-1 h-32" />
              ))}
            </div>
          ) : stops && stops.length > 0 ? (
            stops.map((stopsByDay, index) => {
              return (
                <div className="grid grid-cols-3 col-span-3 gap-4" key={index}>
                  {stopsByDay?.map((stop) => (
                    <Card
                      key={stop?.id}
                      className={`col-span-1 ${
                        stop?.type === "workshop"
                          ? "bg-blue-400/50 animate-[pulse_1s_linear_5]"
                          : ""
                      }`}
                    >
                      <CardHeader>
                        <CardTitle>
                          <span className="">{DAYS[stop?.day]}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-row gap-2">
                          <span className="font-bold">Ruta:</span>
                          <span className="">
                            {
                              routes?.find((route) => route?.id === stop?.route)
                                ?.name
                            }
                          </span>
                        </div>
                        <div className="flex flex-row gap-2">
                          <span className="font-bold">Tipo:</span>
                          <span className="">{TYPE_TRAVEL[stop.type]}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })
          ) : (
            <p className="col-span-3 text-gray-500">
              No hay rutas o paradas asignadas
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
