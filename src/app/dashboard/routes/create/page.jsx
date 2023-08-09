"use client";
import FormRoute from "@/components/MultiStepForm/Route";

const CreateForm = () => {
  return (
    <div className="container mx-auto px-4 h-screen bg-white">
      <div className="grid grid-cols-1 gap-4 p-2">
        <div>
          <FormRoute />
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
