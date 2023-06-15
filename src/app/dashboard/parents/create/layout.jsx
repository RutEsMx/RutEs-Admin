import LogoLayout from "@/components/LogoLayout";
import Image from "next/image";

const CreateParentLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 pb-12 h-full">
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
      </div>
      <div className="grid grid-rows-1 gap-4">
        {children}
      </div>
    </div>
  )
}

export default CreateParentLayout