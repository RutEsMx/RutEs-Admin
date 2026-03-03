export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="h-16 w-16 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute top-0 left-0 h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-muted-foreground text-sm animate-pulse">Cargando...</p>
    </div>
  );
}
