import Skeleton from "@/components/ui/skeleton";

export default function RouteDetailLoading() {
  return (
    <div className="container mx-auto px-4 pb-12 pt-10">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Skeleton variant="text" className="w-48 h-10" />
        </div>
        <div className="flex justify-end gap-2">
          <Skeleton variant="text" className="w-24 h-10" />
          <Skeleton variant="text" className="w-20 h-10" />
          <Skeleton variant="text" className="w-20 h-10" />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg px-4 py-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="col-span-1">
            <div className="space-y-4">
              <Skeleton variant="text" className="w-3/4 h-6" />
              <Skeleton variant="text" className="w-1/2 h-5" />
              <Skeleton variant="text" className="w-1/2 h-5" />
              <Skeleton variant="text" className="w-full h-10" />
              <Skeleton variant="text" className="w-1/3 h-5" />
              <div className="space-y-2">
                <Skeleton variant="text" className="w-full h-8" />
                <Skeleton variant="text" className="w-full h-8" />
                <Skeleton variant="text" className="w-full h-8" />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <Skeleton variant="card" className="w-full h-[400px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
