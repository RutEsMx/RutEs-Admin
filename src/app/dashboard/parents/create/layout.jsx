import Image from "next/image";

const CreateParentLayout = ({ children }) => {
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
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        {children}
      </div>
    </div>
  )
}

export default CreateParentLayout