"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft, CheckCircle2, Copy } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { AUTH_CONTENT, PAGE_ROUTES } from "@/lib/common/constants";

export default function ForgotPasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

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
    try {
      const response = await authApi.forgotPassword(data.email);
      toast.success(AUTH_CONTENT.FORGOT_PASSWORD.SUCCESS_TITLE, {
        description: response.message || AUTH_CONTENT.FORGOT_PASSWORD.SUCCESS_DESCRIPTION,
      });
      if (response.reset_token) {
        setResetToken(response.reset_token);
      }
      setSent(true);
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(resetToken);
    toast.success("Copied to clipboard");
  };

  return (
    <AuthLayout
      title={AUTH_CONTENT.FORGOT_PASSWORD.TITLE}
      description={AUTH_CONTENT.FORGOT_PASSWORD.DESCRIPTION}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{AUTH_CONTENT.FORGOT_PASSWORD.TITLE}</h1>
          <p className="text-slate-500 font-medium">
            Remembered?{" "}
            <Link href={PAGE_ROUTES.LOGIN} className="text-primary hover:underline">
              {AUTH_CONTENT.FORGOT_PASSWORD.BACK_TO_LOGIN}
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
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : AUTH_CONTENT.FORGOT_PASSWORD.BUTTON}
            </Button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mb-2 rotate-3 shadow-sm border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-900 text-2xl">{AUTH_CONTENT.FORGOT_PASSWORD.SUCCESS_TITLE}</p>
              <p className="text-sm text-slate-500 px-4 leading-relaxed font-medium">
                {AUTH_CONTENT.FORGOT_PASSWORD.SUCCESS_DESCRIPTION}
                <br />
                <span className="text-slate-900 font-bold">{email}</span>
              </p>
            </div>

            {/* Display Token for Development/User Request */}
            {resetToken && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reset Token (Dev Only)</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white p-2 rounded border border-slate-200 flex-1 overflow-x-auto font-mono text-slate-700">
                    {resetToken}
                  </code>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={copyToken}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Use this token in the Reset Password page.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {/* Link to Reset Password Page for convenience */}
              <Link href={`${PAGE_ROUTES.RESET_PASSWORD}?token=${resetToken}&email=${email}`}>
                <Button className="w-full h-11 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                  Go to Reset Password (Dev Link)
                </Button>
              </Link>

              <Link href={PAGE_ROUTES.LOGIN}>
                <Button variant="outline" className="w-full h-11 rounded-xl font-bold text-xs">
                  {AUTH_CONTENT.FORGOT_PASSWORD.BACK_TO_LOGIN}
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
            href={PAGE_ROUTES.LOGIN}
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
