"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ForgotPasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setEmail(data.email);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSent(true);
    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Recovery Portal"
      description="Lost your key? Don't worry. Enter your email and we'll help you regain access to your maintenance records."
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reset Password</h1>
          <p className="text-slate-500 font-medium">
            Remembered?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Go back to login
            </Link>
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" required className={errors.email ? "text-destructive" : ""}>
                Account Email
              </Label>
              <div className="relative group">
                <Mail
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.email
                      ? "text-destructive"
                      : "text-slate-400 group-focus-within:text-primary"
                  )}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={cn(
                    "pl-10 h-12 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm",
                    errors.email && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-bold text-destructive mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Instructions"}
            </Button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mb-2 rotate-3 shadow-sm border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-900 text-2xl">Transmitted!</p>
              <p className="text-sm text-slate-500 px-4 leading-relaxed font-medium">
                The recovery payload has been sent to <br />
                <span className="text-slate-900 font-bold">{email}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/auth/login">
                <Button className="w-full h-11 rounded-xl font-bold text-xs bg-slate-900">
                  Return to Cockpit
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setSent(false)}
                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50"
              >
                Resend Frequency
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-8 border-t border-slate-50">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-all"
          >
            <ArrowLeft className="w-3 h-3" />
            Cockpit Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
