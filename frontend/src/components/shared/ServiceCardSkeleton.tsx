export default function ServiceCardSkeleton() {
  return (
    <div className="luxury-card overflow-hidden">
      <div className="h-52 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded w-1/3" />
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="flex gap-3">
          <div className="h-3 skeleton rounded w-16" />
          <div className="h-3 skeleton rounded w-16" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 skeleton rounded w-24" />
          <div className="h-8 w-8 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}
