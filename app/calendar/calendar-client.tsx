"use client";

import { useState, useMemo } from "react";
import { MOCK_REQUESTS, MOCK_EQUIPMENT } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CalendarClient() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 27)); // Dec 2025

  const preventiveRequests = useMemo(
    () => MOCK_REQUESTS.filter((r) => r.type === "Preventive"),
    []
  );

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Calendar</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Schedule and track preventive maintenance tasks.
          </p>
        </div>
        <div className="flex items-center bg-white rounded-xl border p-1 shadow-sm">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9 rounded-lg">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="px-4 font-bold text-sm min-w-[140px] text-center">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </div>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border/50 border rounded-2xl overflow-hidden shadow-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-muted/30 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {paddingDays.map((d) => (
          <div key={`pad-${d}`} className="bg-white/50 h-32" />
        ))}
        {days.map((day) => {
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayRequests = preventiveRequests.filter((r) => r.scheduledDate === dateStr);
          const isToday = day === 27 && currentDate.getMonth() === 11; // Hardcoded mock today

          return (
            <div
              key={day}
              className={cn(
                "bg-white h-32 p-2 border-t border-l flex flex-col gap-1 transition-colors hover:bg-accent/5",
                isToday && "bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                  isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {day}
              </span>
              <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                {dayRequests.map((req) => {
                  const equipment = MOCK_EQUIPMENT.find((e) => e.id === req.equipmentId);
                  return (
                    <div
                      key={req.id}
                      className="p-1.5 bg-blue-50 border border-blue-100 rounded-md text-[10px] group cursor-pointer hover:shadow-sm transition-all"
                    >
                      <p className="font-bold text-blue-700 line-clamp-1">{req.subject}</p>
                      <p className="text-blue-600/70 font-medium">{equipment?.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <CardHeader>
            <CardTitle className="text-sm font-bold opacity-70 uppercase tracking-widest">
              Upcoming preventive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">12</div>
            <p className="text-xs mt-2 opacity-60">Tasks scheduled for the next 30 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
