import FormUser from "@/components/MultiStepForm/Users"

const Page = () => {

  return (
    <div className="container mx-auto px-4 h-screen bg-white">
      <div className="grid grid-cols-1 gap-4 p-2">
        <div>
          <h1>Nuevo Usuario</h1>
          <FormUser />
        </div>
      </div>
    </div>
  )
}

export default Page
