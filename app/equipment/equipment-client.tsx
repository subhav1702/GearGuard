"use client";

import { useState } from "react";
import { MOCK_EQUIPMENT, MOCK_WORK_CENTERS } from "@/lib/mock-data";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { Input } from "@/components/ui/input";
import { Search, Plus, Factory, Wrench, Hash, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateAssetDialog } from "@/components/equipment/CreateAssetDialog";
import { CreateWorkCenterDialog } from "@/components/equipment/CreateWorkCenterDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function EquipmentClient() {
  const [search, setSearch] = useState("");
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [isWCDialogOpen, setIsWCDialogOpen] = useState(false);
  const [viewType, setViewType] = useState<"equipment" | "workCenter">("equipment");

  const filteredEquipment = MOCK_EQUIPMENT.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(search.toLowerCase())
  );

  const filteredWorkCenters = MOCK_WORK_CENTERS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateAsset = (data: any) => {
    console.log("New Asset Data:", data);
  };

  const handleCreateWorkCenter = (data: any) => {
    console.log("New Work Center Data:", data);
  };

  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Assets & Work Centers
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Manage your production infrastructure and individual equipment.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAssetDialogOpen(true)}
            className="rounded-xl px-4 gap-2 h-11 bg-slate-900 hover:bg-slate-800 text-white premium-shadow"
          >
            <Plus className="w-4 h-4" />
            Register Equipment
          </Button>
          <Button
            onClick={() => setIsWCDialogOpen(true)}
            className="rounded-xl px-4 gap-2 h-11 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200"
          >
            <Factory className="w-4 h-4" />
            New Work Center
          </Button>
        </div>

        <CreateAssetDialog
          open={isAssetDialogOpen}
          onOpenChange={setIsAssetDialogOpen}
          onSubmit={handleCreateAsset}
        />
        <CreateWorkCenterDialog
          open={isWCDialogOpen}
          onOpenChange={setIsWCDialogOpen}
          onSubmit={handleCreateWorkCenter}
        />
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 w-fit">
        <button
          onClick={() => setViewType("equipment")}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
            viewType === "equipment"
              ? "bg-slate-900 text-white shadow-lg"
              : "text-slate-400 hover:bg-slate-50"
          )}
        >
          <Wrench className="w-4 h-4" />
          Equipment ({MOCK_EQUIPMENT.length})
        </button>
        <button
          onClick={() => setViewType("workCenter")}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
            viewType === "workCenter"
              ? "bg-slate-900 text-white shadow-lg"
              : "text-slate-400 hover:bg-slate-50"
          )}
        >
          <Factory className="w-4 h-4" />
          Work Centers ({MOCK_WORK_CENTERS.length})
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or serial number..."
            className="pl-10 h-11 border-border/60 bg-white/50 focus-visible:ring-primary/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {viewType === "equipment"
          ? filteredEquipment.map((item) => <EquipmentCard key={item.id} equipment={item} />)
          : filteredWorkCenters.map((wc) => (
              <div
                key={wc.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Factory className="w-6 h-6" />
                  </div>
                  <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold uppercase tracking-wider text-[10px]">
                    {wc.category}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{wc.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Hash className="w-3 h-3" />
                    {wc.code}
                    <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                    <Building2 className="w-3 h-3" />
                    {wc.department}
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 group-hover:border-indigo-100 group-hover:text-indigo-600"
                  >
                    View Production Details
                  </Button>
                </div>
              </div>
            ))}

        {((viewType === "equipment" && filteredEquipment.length === 0) ||
          (viewType === "workCenter" && filteredWorkCenters.length === 0)) && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold">No items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
