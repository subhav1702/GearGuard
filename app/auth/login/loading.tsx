import { Skeleton } from "@/components/ui/skeleton";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function LoginLoading() {
  return (
    <AuthLayout
      title="Access GearGuard"
      description="Enter your credentials to manage your fleet assets and maintenance requests in real-time."
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          <Skeleton className="h-12 w-full rounded-xl mt-4" />
        </div>

        <div className="flex justify-center pt-4">
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
      </div>
    </AuthLayout>
  );
}
