import LogoLayout from "@/components/LogoLayout";

const CreateParentLayout = ({ children }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
      </div>
      {children}
    </>
  );
};

export default CreateParentLayout;
