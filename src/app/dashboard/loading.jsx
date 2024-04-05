export default function Loading() {
  return (
    <div className="container mx-auto my-10 flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
      <h1 className="text-2xl font-bold">Cargando...</h1>
    </div>
  );
}
