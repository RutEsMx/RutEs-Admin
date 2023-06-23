'use client'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const AddButton = () => {
  const router = useRouter()

  // agregar padre funcion
  const handleAddStudent = () => {
    console.log('Agregar estudiante')
    // router.push('/dashboard/students/create')
  }
  
  return (
    <button
      onClick={handleAddStudent}
      className="bg-yellow text-black px-4 py-2 rounded-md flex items-center">
      <PlusIcon className="h-4 w-4 text-black" />
      Agregar
    </button>
  )
}

export default AddButton
