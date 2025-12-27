"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { AUTH_CONTENT, PAGE_ROUTES } from "@/lib/common/constants";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        if (!token || !email) {
            toast.error("Invalid Request", {
                description: "Missing token or email. Please check your reset link.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.resetPassword({
                token,
                email,
                password: data.password,
            });

            if (response.token) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("gearguard_token", response.token);
                    localStorage.setItem("gearguard_user", JSON.stringify(response.user));
                    document.cookie = `gearguard_session=${response.user.id}; path=/; max-age=86400`;
                }
                toast.success(AUTH_CONTENT.RESET_PASSWORD.SUCCESS_TITLE, {
                    description: AUTH_CONTENT.RESET_PASSWORD.SUCCESS_DESCRIPTION,
                });
                router.push(PAGE_ROUTES.LOGIN);
            } else {
                toast.success("Password Reset", { description: "Please login with your new password." });
                router.push(PAGE_ROUTES.LOGIN);
            }

        } catch (error: any) {
            toast.error("Error", {
                description: error.response?.data?.message || "Failed to reset password. Token might be expired.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title={AUTH_CONTENT.RESET_PASSWORD.TITLE}
            description={AUTH_CONTENT.RESET_PASSWORD.DESCRIPTION}
        >
            <div className="space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{AUTH_CONTENT.RESET_PASSWORD.TITLE}</h1>
                    <p className="text-slate-500 font-medium">
                        Create a new strong password for <span className="text-slate-900 font-semibold">{email || "your account"}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" required className={errors.password ? "text-destructive" : ""}>
                            New Password
                        </Label>
                        <div className="relative group">
                            <Lock
                                className={cn(
                                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                    errors.password
                                        ? "text-destructive"
                                        : "text-slate-400 group-focus-within:text-primary"
                                )}
                            />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={cn(
                                    "pl-10 pr-10 h-12 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm",
                                    errors.password && "border-destructive focus-visible:ring-destructive"
                                )}
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-[11px] font-bold text-destructive mt-1 ml-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" required className={errors.confirmPassword ? "text-destructive" : ""}>
                            Confirm Password
                        </Label>
                        <div className="relative group">
                            <Lock
                                className={cn(
                                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                    errors.confirmPassword
                                        ? "text-destructive"
                                        : "text-slate-400 group-focus-within:text-primary"
                                )}
                            />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={cn(
                                    "pl-10 pr-10 h-12 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm",
                                    errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
                                )}
                                {...register("confirmPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-[11px] font-bold text-destructive mt-1 ml-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : AUTH_CONTENT.RESET_PASSWORD.BUTTON}
                    </Button>
                </form>

                <div className="flex justify-center pt-8 border-t border-slate-50">
                    <Link
                        href={PAGE_ROUTES.LOGIN}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-all"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        {AUTH_CONTENT.RESET_PASSWORD.BACK_TO_LOGIN}
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}

export default function ResetPasswordClient() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
