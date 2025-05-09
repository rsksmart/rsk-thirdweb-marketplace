export function NFTSkeleton() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-xl shadow overflow-hidden animate-pulse duration-[2s] hover:shadow-lg hover:-translate-y-1 transition-all h-full flex flex-col">
      {/* Image Section */}
      <div className="w-full aspect-square bg-gray-700/60"></div>

      {/* Name, Type, and Status */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-2/3 h-5 bg-gray-700/60 rounded"></div>
          <div className="w-1/4 h-5 bg-gray-700/60 rounded"></div>
        </div>
        <div className="w-1/3 h-4 bg-gray-700/60 rounded"></div>
      </div>

      {/* Content Section */}
      <div className="p-4 pt-0 mt-auto">
        <div className="pt-2 border-t border-white/10">
          <div className="w-1/2 h-6 bg-gray-700/60 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function NFTGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <NFTSkeleton key={`skeleton-${index}`} />
        ))}
    </div>
  );
}
