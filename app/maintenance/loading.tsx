import { Skeleton } from "@/components/ui/skeleton";

export default function MaintenanceLoading() {
    return (
        <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-10 w-64 rounded-xl" />
                    <Skeleton className="h-4 w-96 mt-2 rounded-lg" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-11 w-44 rounded-xl" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
                        <div className="flex justify-between items-start">
                            <Skeleton className="h-12 w-12 rounded-2xl" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-1/4 rounded-lg" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/60 border border-white rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <Skeleton className="h-10 w-96 rounded-xl" />
                    <div className="flex gap-6">
                        <Skeleton className="h-4 w-12 rounded-full" />
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="h-4 w-20 rounded-full" />
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <Skeleton className="h-8 w-24 rounded-lg" />
                            <Skeleton className="h-8 w-48 rounded-lg" />
                            <Skeleton className="h-8 w-32 rounded-lg" />
                            <Skeleton className="h-8 w-32 rounded-lg" />
                            <Skeleton className="h-8 w-20 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
