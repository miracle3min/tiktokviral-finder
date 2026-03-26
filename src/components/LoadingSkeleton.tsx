'use client';

function SkeletonCard() {
  return (
    <div className="clay-card p-4 space-y-3 animate-pulse">
      {/* Thumbnail */}
      <div className="skeleton rounded-2xl h-48 w-full bg-clay-100/50" />
      {/* Author row */}
      <div className="flex items-center gap-3">
        <div className="skeleton w-9 h-9 rounded-full bg-clay-100/50" />
        <div className="space-y-1.5 flex-1">
          <div className="skeleton h-3.5 w-3/4 rounded-full bg-clay-100/50" />
          <div className="skeleton h-3 w-1/2 rounded-full bg-clay-100/50" />
        </div>
      </div>
      {/* Stats */}
      <div className="flex gap-2">
        <div className="skeleton h-7 w-16 rounded-full bg-clay-100/50" />
        <div className="skeleton h-7 w-16 rounded-full bg-clay-100/50" />
        <div className="skeleton h-7 w-16 rounded-full bg-clay-100/50" />
      </div>
      {/* Score */}
      <div className="flex justify-between items-center pt-1">
        <div className="skeleton h-4 w-24 rounded-full bg-clay-100/50" />
        <div className="skeleton h-10 w-10 rounded-full bg-clay-100/50" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
