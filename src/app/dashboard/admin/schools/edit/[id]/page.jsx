"use client";
import FormSchool from "@/components/MultiStepForm/School";

const getSchool = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/schools/${id}/`,
      { cache: "no-store" },
    );
    if (!response.ok) return { error: response.statusText };
    const data = await response.json();
    data.id = id;
    return data;
  } catch (error) {
    return { error };
  }
};

const Page = async ({ params }) => {
  const { id } = params;
  const school = await getSchool(id);

  return (
    <div className="container mx-auto px-4 h-screen bg-white">
      <div className="grid grid-cols-1 gap-4 p-2">
        <div>
          <p className=" text-2xl font-bold">Editar escuela</p>
          <FormSchool data={school} isEdit />
        </div>
      </div>
    </div>
  );
};

export default Page;
