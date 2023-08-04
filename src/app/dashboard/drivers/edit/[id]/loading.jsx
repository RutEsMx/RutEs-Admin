export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center bg-white h-screen mx-auto">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
      <h1 className="text-2xl font-bold">Editando...</h1>
    </div>
  );
}
