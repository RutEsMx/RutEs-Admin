const Layout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-10 h-full">
      <div className="grid grid-cols-2 gap-4 p-2">
        <div>
          <h1 className="font-bold">Administrador</h1>
        </div>
        <div className="col-span-2 border border-gray rounded-md min-h-[500px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
