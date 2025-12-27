import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function Loading() {
    return (
        <AuthLayout title="Loading..." description="Please wait while we set things up.">
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </AuthLayout>
    );
}
