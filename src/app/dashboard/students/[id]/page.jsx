'use client'
import { useEffect, useState } from "react";
import { getStudentById } from "@/services/StudentsServices";

const Page = ({params}) => {
  const [student, setStudent] = useState({})
  
  useEffect(() => {
    
    const getStudent = async() => {
      const student = await getStudentById(params.id)
      setStudent(student)
    }
    
    getStudent()
    
  }, [])
  
  return (
    <div>
      <h1>Estudiante: {params.id}</h1>
      <div className="rounded-md">
        <div className="flex flex-col">
          <div className="flex flex-row gap-1">
            <span className="font-bold">Nombre:</span>
            <span className="">{student?.name}</span>
          </div>
          <div className="flex flex-row gap-1">
            <span className="font-bold">Apellido Paterno:</span>
            <span className="">{student?.lastName}</span>
          </div>
          <div className="flex flex-row gap-1">
            <span className="font-bold">Apellido Materno:</span>
            <span className="">{student?.secondLastName}</span>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Page