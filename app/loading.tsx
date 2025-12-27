import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 mt-2 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>

      <div className="flex-1 min-h-0 bg-white/40 rounded-3xl p-6 border border-white flex gap-6 overflow-hidden">
        {[1, 2, 3].map((col) => (
          <div key={col} className="flex-1 space-y-4">
            <Skeleton className="h-8 w-32 rounded-lg mb-6" />
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="bg-white/80 p-4 rounded-2xl border border-slate-100 space-y-3"
              >
                <Skeleton className="h-4 w-1/4 rounded-full" />
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex -space-x-2">
                    <Skeleton className="w-6 h-6 rounded-full border border-white" />
                  </div>
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
