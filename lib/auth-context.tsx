"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

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
    // Initialize auth state from cookie or mock session
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const userId = getCookie("gearguard_session");
    if (userId) {
      const foundUser =
        MOCK_USERS.find((u) => u.id === userId) ||
        JSON.parse(localStorage.getItem("gearguard_user") || "null");
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundUser = MOCK_USERS.find((u) => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        document.cookie = `gearguard_session=${foundUser.id}; path=/; max-age=3600`;
        localStorage.setItem("gearguard_user", JSON.stringify(foundUser));
        router.push("/");
      } else {
        throw new Error("Invalid credentials. Try admin@gearguard.com");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newUser: User = {
        id: "u-" + Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: "User",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      };
      setUser(newUser);
      document.cookie = `gearguard_session=${newUser.id}; path=/; max-age=3600`;
      localStorage.setItem("gearguard_user", JSON.stringify(newUser));
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    document.cookie = "gearguard_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("gearguard_user");
    router.push("/auth/login");
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
