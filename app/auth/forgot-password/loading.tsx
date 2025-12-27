import { Skeleton } from "@/components/ui/skeleton";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function ForgotPasswordLoading() {
  return (
    <AuthLayout
      title="Recovery Portal"
      description="Lost your key? Don't worry. Enter your email and we'll help you regain access to your maintenance records."
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          <Skeleton className="h-12 w-full rounded-xl mt-4" />
        </div>

        <div className="flex justify-center pt-8 border-t border-slate-50">
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </div>
    </AuthLayout>
  );
}
