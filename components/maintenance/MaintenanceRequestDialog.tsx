"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wrench, Factory, MessageSquare, Play, PauseCircle, CheckCircle } from "lucide-react";
import { MaintenanceRequest, RequestStatus } from "@/types";
import { MOCK_EQUIPMENT, MOCK_WORK_CENTERS, MOCK_USERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { WorksheetDialog } from "./WorksheetDialog";

interface MaintenanceRequestDialogProps {
  request?: MaintenanceRequest;
  children: React.ReactNode;
}

export function MaintenanceRequestDialog({ request, children }: MaintenanceRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [assetType, setAssetType] = useState<"equipment" | "workCenter">(
    request?.workCenterId ? "workCenter" : "equipment"
  );
  const [status, setStatus] = useState<RequestStatus>(request?.status || "New");

  const statusOptions: { label: string; value: RequestStatus; icon: any; color: string }[] = [
    { label: "In Progress", value: "In Progress", icon: Play, color: "text-amber-600 bg-amber-50" },
    { label: "Blocked", value: "Blocked", icon: PauseCircle, color: "text-red-600 bg-red-50" },
    {
      label: "Ready",
      value: "Ready for next stage",
      icon: CheckCircle,
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
          <div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                {request ? `Edit Request #${request.id.toUpperCase()}` : "New Maintenance Request"}
              </DialogTitle>
            </DialogHeader>
            <p className="text-slate-500 text-sm mt-1">
              Fill in the details for the maintenance activity.
            </p>
          </div>

          <div className="flex gap-2">
            <WorksheetDialog>
              <Button variant="outline" className="rounded-xl gap-2 font-bold bg-white">
                <MessageSquare className="w-4 h-4 text-primary" />
                Worksheet
              </Button>
            </WorksheetDialog>
            <Button className="rounded-xl px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold">
              Save Request
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Status Toggle */}
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 w-fit">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  status === opt.value
                    ? `${opt.color} shadow-sm ring-1 ring-inset ring-black/5`
                    : "text-slate-400 hover:bg-slate-50"
                )}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Subject
                </Label>
                <Input
                  placeholder="e.g., Engine Overheating"
                  defaultValue={request?.subject}
                  className="h-12 rounded-xl bg-slate-100/50 border-none focus-visible:ring-primary shadow-sm"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Maintenance Type
                </Label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setAssetType("equipment")}
                    className={cn(
                      "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                      assetType === "equipment"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                    )}
                  >
                    <Wrench className="w-6 h-6" />
                    <span className="text-sm font-bold">Equipment</span>
                  </button>
                  <button
                    onClick={() => setAssetType("workCenter")}
                    className={cn(
                      "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                      assetType === "workCenter"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                    )}
                  >
                    <Factory className="w-6 h-6" />
                    <span className="text-sm font-bold">Work Center</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {assetType === "equipment" ? "Select Equipment" : "Select Work Center"}
                </Label>
                <Select defaultValue={request?.equipmentId || request?.workCenterId}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-100/50 border-none shadow-sm">
                    <SelectValue placeholder={`Select ${assetType}...`} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {assetType === "equipment"
                      ? MOCK_EQUIPMENT.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.name} ({e.serialNumber})
                          </SelectItem>
                        ))
                      : MOCK_WORK_CENTERS.map((wc) => (
                          <SelectItem key={wc.id} value={wc.id}>
                            {wc.name} [{wc.code}]
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Technician
                </Label>
                <Select defaultValue={request?.technicianId}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-100/50 border-none shadow-sm">
                    <SelectValue placeholder="Assign technician..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {MOCK_USERS.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} className="w-5 h-5 rounded-full" />
                          {u.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Responsible Employee
                </Label>
                <Select defaultValue={request?.requestorId}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-100/50 border-none shadow-sm">
                    <SelectValue placeholder="Who is reporting?" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {MOCK_USERS.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        <div className="flex items-center gap-2">{u.name}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Company
                </Label>
                <Input
                  placeholder="e.g., Acme Corp"
                  defaultValue={request?.company}
                  className="h-12 rounded-xl bg-slate-100/50 border-none shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Description & Notes
            </Label>
            <Textarea
              placeholder="Describe the issue or maintenance tasks..."
              defaultValue={request?.description}
              className="min-h-[120px] rounded-2xl bg-slate-100/50 border-none shadow-sm resize-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
