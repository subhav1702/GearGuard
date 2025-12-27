import { Skeleton } from "@/components/ui/skeleton";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function SignupLoading() {
    return (
        <AuthLayout
            title="Join the Fleet"
            description="Set up your workspace in minutes and start optimizing your equipment maintenance lifecycle today."
        >
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-64 rounded-md" />
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28 rounded-md" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20 rounded-md" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20 rounded-md" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                    </div>

                    <Skeleton className="h-12 w-full rounded-xl mt-4" />
                </div>

                <div className="mt-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
