import Skeleton from "@/components/ui/skeleton";

export default function RoutesLoading() {
  return (
    <div className="space-y-6 p-4">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="text" className="w-32 h-10" />
      </div>

      {/* Map skeleton */}
      <Skeleton variant="card" className="w-full h-64" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 p-4 border rounded-lg">
            <Skeleton variant="text" className="w-3/4 h-6" />
            <Skeleton variant="text" className="w-1/2 h-4" />
            <Skeleton variant="text" className="w-full h-4" />
            <div className="flex gap-2 mt-4">
              <Skeleton variant="text" className="w-20 h-8" />
              <Skeleton variant="text" className="w-20 h-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
