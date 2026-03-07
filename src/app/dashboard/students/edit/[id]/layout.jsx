import LogoLayout from "@/components/LogoLayout";

const Layout = ({ children }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-2">
        <LogoLayout />
      </div>
      <div className="grid grid-rows-1 gap-4">{children}</div>
    </>
  );
};

export default Layout;
