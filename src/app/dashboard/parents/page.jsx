import LogoLayout from "@/components/LogoLayout";
import AddButton from "./AddButton";
import Image from "next/image";

async function getAllUsers() {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}dashboard/parents/api/`, { next: { cache: "no-store" }})
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}dashboard/parents/api/`)
  const data = await res.json()
  return data
}
  

const Parents = async () => {
  const users = await getAllUsers()
  
  return (
    <div className="container mx-auto px-4 pb-12 h-full">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
        <div className="flex justify-end items-center gap-4">
          <span>Filtrar padres</span>
          <AddButton />
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">

        {
          users?.data?.map(user => (
            <div key={user.id} className="bg-white rounded-md shadow-md p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                
                  <span>{user.name}</span>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Parents;