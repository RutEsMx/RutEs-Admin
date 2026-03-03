import Skeleton from "@/components/ui/skeleton";

export default function StudentsLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-48 h-8" />
        <div className="flex gap-2">
          <Skeleton variant="text" className="w-28 h-10" />
          <Skeleton variant="text" className="w-32 h-10" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton variant="text" className="w-full h-6" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b flex items-center gap-4">
            <Skeleton variant="circular" className="h-10 w-10" />
            <Skeleton variant="text" className="flex-1 h-4" />
            <Skeleton variant="text" className="w-24 h-4" />
            <Skeleton variant="text" className="w-20 h-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
