"use client";
import FormAuxiliar from "@/components/MultiStepForm/Auxiliar";

const CreateForm = () => {
  return (
    <div className="container mx-auto px-4 h-screen bg-white">
      <div className="grid grid-cols-1 gap-4 p-2">
        <div>
          <FormAuxiliar />
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
