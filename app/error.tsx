"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-8 border border-red-100 shadow-sm animate-bounce">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <h1 className="text-3xl font-black text-slate-900">System Malfunction</h1>
        <p className="text-slate-500 font-medium leading-relaxed">
          A critical error occurred in the GearGuard core. Our technicians have been notified.
        </p>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4 overflow-hidden">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">
            Error Trace
          </p>
          <p className="text-xs font-mono text-red-400 truncate">
            {error.message || "Unknown internal error"}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => reset()}
          className="h-12 px-8 rounded-xl font-bold gap-2 premium-shadow bg-slate-900 text-white"
        >
          <RefreshCcw className="w-4 h-4" />
          Reboot System
        </Button>
        <Link href="/">
          <Button
            variant="outline"
            className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200 gap-2"
          >
            <Home className="w-4 h-4" />
            Vitals Dashboard
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-8 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
        GearGuard Emergency Protocol • Code: 500
      </div>
    </div>
  );
}
