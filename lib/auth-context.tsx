"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "./common/constants";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state from localStorage/session
    const savedUser = localStorage.getItem("gearguard_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Handled by login-client.tsx, but providing a stub here if needed
    setIsLoading(false);
  };

  const signup = async (name: string, email: string) => {
    // Handled by signup-client.tsx
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    document.cookie = "gearguard_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("gearguard_user");
    router.push(PAGE_ROUTES.LOGIN);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "User",
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
