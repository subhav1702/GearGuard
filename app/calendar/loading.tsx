import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 mt-2 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-48 rounded-xl" />
      </div>

      <div className="grid grid-cols-7 gap-px bg-border/50 border rounded-2xl overflow-hidden shadow-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Skeleton key={day} className="h-12 w-full rounded-none" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="bg-white h-32 p-2 border-t border-l space-y-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
      </div>
    </div>
  );
}
