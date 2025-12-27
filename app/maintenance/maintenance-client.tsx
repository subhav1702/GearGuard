"use client";

import { useState } from "react";
import { MOCK_REQUESTS, MOCK_EQUIPMENT, MOCK_WORK_CENTERS, MOCK_USERS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Wrench, Clock, AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MaintenanceRequestDialog } from "@/components/maintenance/MaintenanceRequestDialog";

export default function MaintenanceClient() {
  const [search, setSearch] = useState("");

  const filteredRequests = MOCK_REQUESTS.filter((req) => {
    const equipment = MOCK_EQUIPMENT.find((e) => e.id === req.equipmentId);
    const workCenter = MOCK_WORK_CENTERS.find((wc) => wc.id === req.workCenterId);
    return (
      req.subject.toLowerCase().includes(search.toLowerCase()) ||
      equipment?.name.toLowerCase().includes(search.toLowerCase()) ||
      workCenter?.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const criticalItems = MOCK_REQUESTS.filter((r) => r.priority === "Critical").length;
  const technicalLoad = MOCK_REQUESTS.filter((r) => r.status === "In Progress").length;
  const pendingOverdue = MOCK_REQUESTS.filter(
    (r) => r.status === "New" || r.status === "Blocked"
  ).length;

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Maintenance Records</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Detailed log of all service activities and equipment status.
          </p>
        </div>
        <div className="flex gap-3">
          <MaintenanceRequestDialog>
            <Button className="rounded-xl px-6 gap-2 h-11 bg-slate-900 hover:bg-slate-800 text-white premium-shadow">
              <Plus className="w-5 h-5" />
              Schedule Service
            </Button>
          </MaintenanceRequestDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl premium-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <Badge className="bg-red-200 text-red-700 border-none font-bold">Action Required</Badge>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-red-900">{criticalItems}</h3>
            <p className="text-red-700/70 font-bold text-sm uppercase tracking-wider">
              Critical Equipment
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl premium-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Wrench className="w-6 h-6" />
            </div>
            <Badge className="bg-blue-200 text-blue-700 border-none font-bold">Active</Badge>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-blue-900">{technicalLoad}</h3>
            <p className="text-blue-700/70 font-bold text-sm uppercase tracking-wider">
              Technical Load
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl premium-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <Clock className="w-6 h-6" />
            </div>
            <Badge className="bg-emerald-200 text-emerald-700 border-none font-bold">Pending</Badge>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-emerald-900">{pendingOverdue}</h3>
            <p className="text-emerald-700/70 font-bold text-sm uppercase tracking-wider">
              Pending / Overdue
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm border border-white rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Find logs by subject or asset..."
              className="pl-10 h-10 bg-slate-100/50 border-none rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                New
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                In Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Repaired
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Request #</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Company</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => {
                const equipment = MOCK_EQUIPMENT.find((e) => e.id === req.equipmentId);
                const workCenter = MOCK_WORK_CENTERS.find((wc) => wc.id === req.workCenterId);
                const technician = MOCK_USERS.find((u) => u.id === req.technicianId);
                const requestor = MOCK_USERS.find((u) => u.id === req.requestorId);

                return (
                  <MaintenanceRequestDialog request={req} key={req.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-b border-slate-100">
                      <td className="px-6 py-5">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{req.id.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 leading-tight">
                            {req.subject}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                            <Wrench className="w-3 h-3" /> {equipment?.name || workCenter?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 border border-white overflow-hidden shadow-sm">
                            <img src={requestor?.avatar} alt="Avatar" className="w-full h-full" />
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            {requestor?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 border border-white overflow-hidden shadow-sm">
                            <img
                              src={
                                technician?.avatar ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder`
                              }
                              alt="Avatar"
                              className="w-full h-full"
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            {technician?.name || "Unassigned"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className="rounded-lg px-2 py-0 text-[10px] font-bold text-slate-500 border-slate-200"
                        >
                          {req.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          className={cn(
                            "rounded-full px-2 py-0 text-[10px] font-bold border-none",
                            req.status === "New" && "bg-blue-50 text-blue-600",
                            req.status === "In Progress" && "bg-amber-50 text-amber-600",
                            req.status === "Repaired" && "bg-emerald-50 text-emerald-600",
                            req.status === "Scrap" && "bg-red-50 text-red-600",
                            req.status === "Blocked" && "bg-slate-100 text-slate-500",
                            req.status === "Ready for next stage" && "bg-indigo-50 text-indigo-600"
                          )}
                        >
                          {req.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-semibold text-slate-600">{req.company}</span>
                      </td>
                    </tr>
                  </MaintenanceRequestDialog>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="p-20 text-center space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">No logs detected</p>
              <p className="text-xs text-slate-400 font-medium">
                Try adjusting your search filters to find records.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
