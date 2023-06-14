'use client'
import Image from "next/image";
import { PlusIcon } from '@heroicons/react/24/outline'
import { useRouter } from "next/navigation";

const Parents = () => {
  
  const router = useRouter()
  
  // agregar padre funcion
  const handleAddParent = () => {
    console.log('Agregar padre')
    router.push('/dashboard/parents/create')
    
  }
    
  
  
  return (
    <div className="container mx-auto px-4 pb-12 h-full">
      <div className="grid grid-cols-2 gap-4 p-2">
        <div>
          <Image
            src="/rutes_logo.png"
            alt="Rutes"
            width={150}
            height={70}
            priority
          />
          <h1>Padres</h1>
        </div>
        <div className="flex justify-end items-center gap-4">
          <span>Filtrar padres</span>
          <button
            onClick={handleAddParent}
            className="bg-yellow text-black px-4 py-2 rounded-md flex items-center">
              <PlusIcon className="h-4 w-4 text-black" />
              Agregar
          </button>
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4"></div>
    </div>
  );
}

export default Parents;