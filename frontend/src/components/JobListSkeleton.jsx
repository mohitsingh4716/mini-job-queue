function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <div className="skeleton h-4 w-40 rounded" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-3 w-14 rounded" />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <div className="skeleton h-7 w-20 rounded-lg" />
        <div className="skeleton h-7 w-7 rounded-lg" />
      </div>
    </div>
  );
}

function JobListSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] shadow-soft">
      <div className="divide-y divide-white/[0.05]">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}

export default JobListSkeleton;
