import FormTutor from "@/components/MultiStepForm/Tutor";

const Page = ({ params }) => {
  const { id } = params;
  return (
    <div className="container mx-auto px-4 pb-12 h-screen pt-20">
      <FormTutor studentId={id} />
    </div>
  );
};

export default Page;
