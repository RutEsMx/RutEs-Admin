import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const { id } = params;

  return (
    <div className="container mx-auto px-4 h-screen">
      <div className="grid grid-cols-2 gap-4 p-2">
        <div>
          <h1 className="font-bold">Formulario</h1>
          <p>{id}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
