"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { Toaster } from "sonner";
import * as React from "react";

const queryClient = new QueryClient();

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme="light"
        disableTransitionOnChange
        {...props}
      >
        {children}
        <Toaster position="top-right" richColors />
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
