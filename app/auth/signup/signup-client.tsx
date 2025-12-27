"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/lib/validations/auth";
import { useSignup } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

export default function SignupClient() {
  const { mutate: signup, isPending: isLoading } = useSignup();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupInput) => {
    setServerError("");
    signup(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        confirm_password: data.confirmPassword,
        role: data.role,
      },
      {
        onError: (error: any) => {
          setServerError(error.response?.data?.message || "Signup failed.");
        },
      }
    );
  };

  return (
    <AuthLayout
      title="Join the Fleet"
      description="Set up your workspace in minutes and start optimizing your equipment maintenance lifecycle today."
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h1>
          <p className="text-slate-500 font-medium">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" required>
              Full Name
            </Label>
            <div className="relative group">
              <User
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                  "text-slate-400 group-focus-within:text-primary"
                )}
              />
              <Input
                id="name"
                placeholder="John Doe"
                className={cn(
                  "pl-10 h-11 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm",
                  errors.name && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" required>
              Work Email
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
                placeholder="john@example.com"
                className={cn(
                  "pl-10 h-11 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm",
                  errors.email && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" required>
                Password
              </Label>
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
                    "pl-10 h-11 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm",
                    errors.password && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("password")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                required
                className={errors.confirmPassword ? "text-destructive" : ""}
              >
                Confirm
              </Label>
              <div className="relative group">
                <ShieldCheck
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.confirmPassword
                      ? "text-destructive"
                      : "text-slate-400 group-focus-within:text-primary"
                  )}
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "pl-10 h-11 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm",
                    errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("confirmPassword")}
                />
              </div>
            </div>
          </div>
          {errors.password && (
            <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
              {errors.password.message}
            </p>
          )}
          {errors.confirmPassword && (
            <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
              {errors.confirmPassword.message}
            </p>
          )}

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="h-11 bg-white/50 border-slate-200/60 rounded-xl focus:bg-white transition-all shadow-sm">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-bold flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white gap-2 mt-4 premium-shadow transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Create Workspace <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3 items-start">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">
              Security Standards
            </p>
            <p className="text-[11px] text-slate-500 font-medium leading-normal">
              Your data is encrypted using AES-256 standards. We never share your assets with 3rd
              parties.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
