"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Wrench, Clock, AlertTriangle, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MaintenanceRequestDialog } from "@/components/maintenance/MaintenanceRequestDialog";
import { maintenanceRequestsApi, MaintenanceRequest } from "@/lib/api/maintenance-requests";
import { equipmentApi } from "@/lib/api/equipment";
import { teamsApi, MaintenanceTeam } from "@/lib/api/teams";
import { Equipment } from "@/types";

export default function MaintenanceClient() {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [requestsData, equipmentData, teamsData] = await Promise.all([
          maintenanceRequestsApi.getAll(),
          equipmentApi.getAll(),
          teamsApi.getAll(),
        ]);

        setRequests(requestsData);
        setEquipment(equipmentData);
        setTeams(teamsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load maintenance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const equipmentItem = equipment.find((e) => e.id === req.equipment_id?.toString());
    return (
      req.subject.toLowerCase().includes(search.toLowerCase()) ||
      equipmentItem?.name.toLowerCase().includes(search.toLowerCase()) ||
      req.equipment_name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Calculate metrics based on API status values
  const criticalItems = requests.filter((r) => r.status === "pending").length;
  const technicalLoad = requests.filter((r) => r.status === "in_progress").length;
  const pendingOverdue = requests.filter(
    (r) => r.status === "pending" || r.status === "assigned"
  ).length;

  const handleEdit = (req: MaintenanceRequest) => {
    setEditingRequest(req);
    setIsDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingRequest(null);
  };

  const handleSuccess = () => {
    maintenanceRequestsApi.getAll().then(setRequests);
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <p className="text-sm font-medium text-slate-500">Loading records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="bg-red-50 border border-red-100 p-8 rounded-3xl flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-red-900">Error Loading Data</h3>
            <p className="text-sm text-red-700/70">{error}</p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="rounded-xl border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }


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
          <Button
            onClick={() => {
              setEditingRequest(null);
              setIsDialogOpen(true);
            }}
            className="rounded-xl px-6 gap-2 h-11 bg-slate-900 hover:bg-slate-800 text-white premium-shadow"
          >
            <Plus className="w-5 h-5" />
            Schedule Service
          </Button>
          <MaintenanceRequestDialog
            open={isDialogOpen}
            onOpenChange={handleOpenChange}
            request={editingRequest}
            onSuccess={handleSuccess}
          />
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
                Pending
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
                Completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Scrapped
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
                const equipmentItem = equipment.find((e) => e.id === req.equipment_id?.toString());

                return (
                  <tr
                    key={req.id}
                    onClick={() => handleEdit(req)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-b border-slate-100"
                  >
                    <td className="px-6 py-5">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        #{req.id}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">
                          {req.subject}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                          <Wrench className="w-3 h-3" /> {req.equipment_name || equipmentItem?.name || "Unknown Asset"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 border border-white overflow-hidden shadow-sm flex items-center justify-center">
                          <span className="text-[8px] font-bold text-slate-500">?</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {req.request_type === "corrective" ? "Breakdown" : "Scheduled"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-white overflow-hidden shadow-sm flex items-center justify-center">
                          <Wrench className="w-3 h-3 text-slate-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {req.assigned_to_name || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="outline"
                        className="rounded-lg px-2 py-0 text-[10px] font-bold text-slate-500 border-slate-200 uppercase"
                      >
                        {req.request_type}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        className={cn(
                          "rounded-full px-2 py-0 text-[10px] font-bold border-none capitalize",
                          req.status === "pending" && "bg-blue-50 text-blue-600",
                          req.status === "assigned" && "bg-indigo-50 text-indigo-600",
                          req.status === "in_progress" && "bg-amber-50 text-amber-600",
                          req.status === "completed" && "bg-emerald-50 text-emerald-600",
                          req.status === "scrapped" && "bg-red-50 text-red-600"
                        )}
                      >
                        {req.status?.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-semibold text-slate-600">
                        {req.scheduled_at ? new Date(req.scheduled_at).toLocaleDateString() : "-"}
                      </span>
                    </td>
                  </tr>
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
