export default function Loading() {
  return (
    <div className="container mx-auto px-4 h-screen bg-white py-8">
      <div className="grid grid-cols-1 gap-4 p-2">
        <div className="animate-pulse">
          <div className="flex justify-end gap-4 mb-4">
            <div className="h-10 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-24 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            <div className="col-span-3 md:col-span-2 border-2 border-gray rounded-lg p-4 space-y-4">
              <div className="flex gap-2 mb-2">
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded" />
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded w-24" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
            <div className="col-span-3 border-2 border-gray rounded-lg p-4">
              <div className="h-80 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
