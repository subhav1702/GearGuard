"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useLogin } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function LoginClient() {
  const { mutate: login, isPending: isLoading } = useLogin();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    setServerError("");
    // We can clear errors here if needed
    login(data, {
      onError: (error: any) => {
        setServerError(error.response?.data?.message || "Invalid credentials.");
      },
    });
  };

  return (
    <AuthLayout
      title="Access GearGuard"
      description="Enter your credentials to manage your fleet assets and maintenance requests in real-time."
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign In</h1>
          <p className="text-slate-500 font-medium">
            New here?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email Address
            </Label>
            <div className="relative group">
              <Mail
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                  "text-slate-400 group-focus-within:text-primary"
                )}
              />
              <Input
                id="email"
                type="email"
                placeholder="admin@gearguard.com"
                className={cn(
                  "pl-10 h-12 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm",
                  errors.email && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] font-bold text-destructive mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" required>
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] font-bold tracking-wider text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <Lock
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                  "text-slate-400 group-focus-within:text-primary"
                )}
              />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={cn(
                  "pl-10 h-12 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm",
                  errors.password && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] font-bold text-destructive mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            title="Sign In"
            variant="default"
            size="default"
            className="w-full h-12 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white gap-2 mt-4 premium-shadow transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign Into Workspace <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-[11px] text-slate-400 font-medium pt-4">
          By signing in, you agree to our{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
