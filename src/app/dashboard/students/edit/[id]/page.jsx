"use client";
import FormStudentEdit from "@/components/MultiStepForm/StudentEdit";
import { subscribeStudentById } from "@/services/StudentsServices";
import { useStudentsStore } from "@/store/useStudentsStore";
import Link from "next/link";
import { useEffect, use } from "react";

const Page = props => {
  const params = use(props.params);
  const { id } = params;
  const { student, setStudent } = useStudentsStore();

  useEffect(() => {
    const unsub = subscribeStudentById(id);
    return () => {
      unsub && unsub();
      setStudent(null);
    };
  }, [id, setStudent]);

  return (
    <div className="container mx-auto px-4 h-screen bg-white py-8">
      <div className="grid grid-cols-1 gap-4 p-2">
        {student?.error ? (
          <div className="flex flex-col justify-center items-center h-full mt-4">
            <p className="h-full mx-auto text-2xl">Estudiante no encontrado</p>
            <div className="bg-primary rounded px-4 py-1 mt-6">
              <Link href="/dashboard/drivers">
                <p className="h-full mx-auto text-2xl">Regresar</p>
              </Link>
            </div>
          </div>
        ) : (
          <div>{student && <FormStudentEdit data={student} isEdit />}</div>
        )}
      </div>
    </div>
  );
};

export default Page;
