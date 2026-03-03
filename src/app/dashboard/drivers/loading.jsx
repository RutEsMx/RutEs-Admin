import Skeleton from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="text" className="w-32 h-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="card" className="h-32" />
        ))}
      </div>
    </div>
  );
}
