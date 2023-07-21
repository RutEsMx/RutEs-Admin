import FormUser from "@/components/MultiStepForm/Users";

const Page = () => {
  return (
    <div className="container mx-auto px-4 h-screen bg-white">
      <div className="grid grid-cols-1 gap-4 p-2">
        <div>
          <p className=" text-2xl font-bold">Nuevo Usuario</p>
          <FormUser />
        </div>
      </div>
    </div>
  );
};

export default Page;
