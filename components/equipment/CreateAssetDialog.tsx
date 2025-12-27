"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema, EquipmentInput } from "@/lib/validations/equipment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { teamsApi, MaintenanceTeam } from "@/lib/api/teams";
import { toast } from "sonner";
import { AlertTriangle, Wrench, Hash, Building2, MapPin, CalendarDays, ShieldCheck, Users, UserCheck, Crown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { equipmentApi } from "@/lib/api/equipment";
import { departmentsApi, Department } from "@/lib/api/departments";

interface CreateAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateAssetDialog({ open, onOpenChange, onSuccess }: CreateAssetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EquipmentInput>({
    resolver: zodResolver(equipmentSchema),
  });

  // Fetch departments and teams when dialog opens
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoadingDeps(true);
    try {
      const [depsData, teamsData] = await Promise.all([
        departmentsApi.getAll(),
        teamsApi.getAll(),
      ]);
      setDepartments(depsData);
      setTeams(teamsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load departments and teams");
    } finally {
      setLoadingDeps(false);
    }
  };

  const handleFormSubmit = async (data: EquipmentInput) => {
    setIsSubmitting(true);
    try {
      await equipmentApi.create(data);
      toast.success("Equipment registered successfully!");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating equipment:", error);
      toast.error(error.response?.data?.message || "Failed to register equipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-2xl">
        <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Wrench size={120} />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-bold">Register Equipment Asset</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Add a new asset to your maintenance inventory.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6 bg-white">
          {(departments.length === 0 || teams.length === 0) && !loadingDeps && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
              <div className="text-sm">
                <p className="font-bold">Missing Prerequisites</p>
                <p className="opacity-80">
                  {departments.length === 0 && teams.length === 0
                    ? "Please add a department and a maintenance team first."
                    : departments.length === 0
                      ? "Please add a department first."
                      : "Please add a maintenance team first."}
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            {/* Asset Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                Asset Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Wrench
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.name ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="name"
                  placeholder="e.g. CNC Machine 01"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label htmlFor="serialNumber" className={errors.serialNumber ? "text-destructive" : ""}>
                Serial Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Hash
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.serialNumber ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="serialNumber"
                  placeholder="CNC-001"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.serialNumber && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("serialNumber")}
                />
              </div>
              {errors.serialNumber && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.serialNumber.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="location" className={errors.location ? "text-destructive" : ""}>
                Location <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.location ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="location"
                  placeholder="Plant Floor A"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.location && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("location")}
                />
              </div>
              {errors.location && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <Label htmlFor="purchaseDate" className={errors.purchaseDate ? "text-destructive" : ""}>
                Purchase Date <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <CalendarDays
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.purchaseDate ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="purchaseDate"
                  type="date"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.purchaseDate && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("purchaseDate")}
                />
              </div>
              {errors.purchaseDate && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.purchaseDate.message}
                </p>
              )}
            </div>

            {/* Warranty Expiry */}
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiration" className={errors.warrantyExpiration ? "text-destructive" : ""}>
                Warranty Expiry <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <ShieldCheck
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.warrantyExpiration ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="warrantyExpiration"
                  type="date"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.warrantyExpiration && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("warrantyExpiration")}
                />
              </div>
              {errors.warrantyExpiration && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.warrantyExpiration.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="departmentId" className={errors.departmentId ? "text-destructive" : ""}>
                Department <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11",
                        errors.departmentId && "border-destructive focus:ring-destructive"
                      )}
                    >
                      <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingDeps ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : departments.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No departments found
                        </SelectItem>
                      ) : (
                        departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departmentId && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.departmentId.message}
                </p>
              )}
            </div>

            {/* Maintenance Team */}
            <div className="space-y-2">
              <Label htmlFor="maintenanceTeamId" className={errors.maintenanceTeamId ? "text-destructive" : ""}>
                Maintenance Team <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="maintenanceTeamId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11",
                        errors.maintenanceTeamId && "border-destructive focus:ring-destructive"
                      )}
                    >
                      <Users className="w-4 h-4 mr-2 text-slate-400" />
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingDeps ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : teams.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No teams found
                        </SelectItem>
                      ) : (
                        teams.map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.maintenanceTeamId && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.maintenanceTeamId.message}
                </p>
              )}
            </div>

            {/* Owner ID (Temporary text input - should be a user dropdown) */}
            <div className="space-y-2">
              <Label htmlFor="ownerId" className={errors.ownerId ? "text-destructive" : ""}>
                Owner ID <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Crown
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.ownerId ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="ownerId"
                  type="number"
                  placeholder="Enter owner user ID"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.ownerId && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("ownerId", { valueAsNumber: true })}
                />
              </div>
              {errors.ownerId && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.ownerId.message}
                </p>
              )}
            </div>

            {/* Default Technician ID (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="defaultTechnicianId">Default Technician ID</Label>
              <div className="relative">
                <UserCheck
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                />
                <Input
                  id="defaultTechnicianId"
                  type="number"
                  placeholder="Optional"
                  className="pl-10 h-11"
                  {...register("defaultTechnicianId", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className={errors.status ? "text-destructive" : ""}>
                Status <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11",
                        errors.status && "border-destructive focus:ring-destructive"
                      )}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Down">Down</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-slate-100 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl font-bold h-11 px-6 text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loadingDeps}
              className="rounded-xl font-bold h-11 px-8 gap-2 bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Equipment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
