"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wrench, Calendar, Settings, Hammer, Activity, Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import * as image from "@/assets/index";
import Image from "next/image";

const navigation = [
  // { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Equipment", href: "/equipment", icon: Wrench },
  // { name: "Calendar", href: "/calendar", icon: Calendar },
  // { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen fixed left-0 top-0 z-20 transition-all">
      <div className="p-6 flex items-center gap-3">
        <Image src={image.brand_logo} alt="Brand Logo" width={256} height={171} />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.name}
              </div>
              {isActive && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border/50">
        <div className="bg-muted/30 rounded-xl p-4 border border-border/40">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">System Health</span>
          </div>
          <div className="w-full bg-border/40 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[94%]" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium uppercase tracking-wider">
            All systems operational
          </p>
        </div>
      </div>
    </aside>
  );
}
