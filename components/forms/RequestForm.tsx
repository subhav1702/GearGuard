"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_EQUIPMENT, MOCK_TEAMS, MOCK_USERS } from "@/lib/mock-data";
import { Equipment, Team, RequestType } from "@/types";
import { Wrench, Users, Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function RequestForm({ open, onOpenChange, onSubmit }: RequestFormProps) {
  const [step, setStep] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<RequestType>("Corrective");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Auto-fill logic
  useEffect(() => {
    if (selectedEquipment) {
      const team = MOCK_TEAMS.find((t) => t.id === selectedEquipment.maintenanceTeamId);
      if (team) {
        setSelectedTeam(team);
      }
    } else {
      setSelectedTeam(null);
    }
  }, [selectedEquipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      subject,
      equipmentId: selectedEquipment?.id,
      teamId: selectedTeam?.id,
      type,
      scheduledDate: date,
    });
    onOpenChange(false);
    // Reset
    setStep(1);
    setSelectedEquipment(null);
    setSubject("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-6 bg-slate-50 border-b">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-primary" />
              </div>
              New Maintenance Request
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-70">
                1. Select Equipment
              </label>
              <div className="grid grid-cols-1 gap-2">
                {MOCK_EQUIPMENT.map((eq) => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => setSelectedEquipment(eq)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                      selectedEquipment?.id === eq.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:bg-accent/50"
                    )}
                  >
                    <div>
                      <p className="text-sm font-bold">{eq.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        {eq.serialNumber}
                      </p>
                    </div>
                    {selectedEquipment?.id === eq.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedEquipment && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight">
                      Auto-Assigned Team
                    </p>
                    <p className="text-sm font-bold text-emerald-950">{selectedTeam?.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-70">
                    2. Request Details
                  </label>
                  <Input
                    placeholder="Subject (e.g., Leaking Oil)"
                    className="h-11 rounded-xl"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground">Type</label>
                      <div className="flex bg-muted/30 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setType("Corrective")}
                          className={cn(
                            "flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all",
                            type === "Corrective"
                              ? "bg-white shadow text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          Corrective
                        </button>
                        <button
                          type="button"
                          onClick={() => setType("Preventive")}
                          className={cn(
                            "flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all",
                            type === "Preventive"
                              ? "bg-white shadow text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          Preventive
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground">
                        Scheduled Date
                      </label>
                      <Input
                        type="date"
                        className="h-8 rounded-lg text-xs"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 bg-slate-50 border-t">
            <Button
              type="submit"
              className="w-full rounded-xl h-12 font-bold gap-2 premium-shadow"
              disabled={!selectedEquipment || !subject}
            >
              Create Work Order
              <ArrowRight className="w-4 h-4 text-white/50" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
