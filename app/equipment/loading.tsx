import { Skeleton } from "@/components/ui/skeleton";

export default function EquipmentLoading() {
  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 mt-2 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-11 w-44 rounded-xl" />
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white/50 p-2 rounded-2xl border border-slate-100 w-fit">
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
