import Skeleton from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-64 h-8" />
        <Skeleton variant="text" className="w-40 h-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="card" className="h-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Skeleton variant="card" className="h-80" />
        </div>
        <div>
          <Skeleton variant="card" className="h-80" />
        </div>
      </div>
    </div>
  );
}
