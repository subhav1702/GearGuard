"use client";

import { LogOut, Bell, Search, User as UserIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_USERS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout } = useAuth();
  const currentUser = user || MOCK_USERS[0]; // Defaulting to Admin for now

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search requests, assets..."
          className="pl-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all rounded-xl"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Hidden for now */}
        {/* <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-accent transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                </Button> */}

        <div className="h-8 w-[1px] bg-border mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-2 group/user cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{currentUser.name}</p>
                <Badge variant="secondary" className="mt-1 font-normal text-[10px] px-1.5 py-0">
                  {currentUser.role}
                </Badge>
              </div>
              <div className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center overflow-hidden premium-shadow transition-transform group-hover/user:scale-105">
                <img
                  src={"https://api.dicebear.com/7.x/avataaars/svg?seed=John"}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 rounded-xl border-border/50 shadow-xl p-1.5 backdrop-blur-md bg-white/90"
          >
            <DropdownMenuLabel className="font-semibold text-xs text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
              Account
            </DropdownMenuLabel>
            {/* <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer">
              <UserIcon className="w-4 h-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer">
              <Settings className="w-4 h-4" />
              <span>Workspace Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-border/40" /> */}
            <DropdownMenuItem
              onClick={logout}
              className="rounded-lg gap-2 text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
