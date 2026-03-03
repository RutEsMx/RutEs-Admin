import Skeleton from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="text" className="w-32 h-10" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="card" className="h-24" />
        ))}
      </div>
    </div>
  );
}
