import { useMutation } from "@tanstack/react-query";
import { authApi, SignupRequest } from "@/lib/api/auth";
import { LoginInput } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      // Store token and user data
      if (typeof window !== "undefined") {
        localStorage.setItem("gearguard_token", data.token);
        localStorage.setItem("gearguard_user", JSON.stringify(data.user));
        // Also set cookie for middleware if needed, though we primarily use client-side storage for now
        document.cookie = `gearguard_session=${data.user.id}; path=/; max-age=86400`;
      }
      toast.success("Welcome back!", {
        description: "You successfully logged in to your workspace.",
      });
      router.push("/");
    },
    onError: (error: any) => {
      toast.error("Login failed", {
        description: error.response?.data?.message || "Invalid credentials. Please try again.",
      });
    },
  });
};

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("gearguard_token", data.token);
        localStorage.setItem("gearguard_user", JSON.stringify(data.user));
        document.cookie = `gearguard_session=${data.user.id}; path=/; max-age=86400`;
      }
      toast.success("Account created!", {
        description: "Your workspace has been set up successfully.",
      });
      router.push("/");
    },
    onError: (error: any) => {
      toast.error("Signup failed", {
        description: error.response?.data?.message || "Could not create account. Please try again.",
      });
    },
  });
};
