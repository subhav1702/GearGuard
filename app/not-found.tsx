"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hammer, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary animate-pulse">
          <Search className="w-12 h-12" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-400 border border-slate-100">
          <Hammer className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <h1 className="text-7xl font-black tracking-tighter text-slate-900">404</h1>
        <h2 className="text-2xl font-bold text-slate-800">Coordinates Lost</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          The asset or page you are looking for has been decommissioned or moved to a different
          sector.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="h-12 px-8 rounded-xl font-bold gap-2 premium-shadow">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Button
          variant="outline"
          className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200"
        >
          Contact Support
        </Button>
      </div>

      <div className="absolute bottom-8 text-[11px] font-bold text-slate-300 uppercase tracking-widest">
        GearGuard Sector 404 • Status: Offline
      </div>
    </div>
  );
}
