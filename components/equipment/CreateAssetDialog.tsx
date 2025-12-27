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
import {
  Wrench,
  Hash,
  Building2,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Users,
  UserCheck,
  Crown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { equipmentApi } from "@/lib/api/equipment";
import { departmentsApi, Department } from "@/lib/api/departments";
import { teamsApi, MaintenanceTeam } from "@/lib/api/teams";
import { toast } from "sonner";

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
              <Label htmlFor="serial_number" className={errors.serial_number ? "text-destructive" : ""}>
                Serial Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Hash
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.serial_number ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="serial_number"
                  placeholder="CNC-001"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.serial_number && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("serial_number")}
                />
              </div>
              {errors.serial_number && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.serial_number.message}
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
              <Label htmlFor="purchase_date" className={errors.purchase_date ? "text-destructive" : ""}>
                Purchase Date <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <CalendarDays
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.purchase_date ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="purchase_date"
                  type="date"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.purchase_date && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("purchase_date")}
                />
              </div>
              {errors.purchase_date && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.purchase_date.message}
                </p>
              )}
            </div>

            {/* Warranty Expiry */}
            <div className="space-y-2">
              <Label htmlFor="warranty_expiry" className={errors.warranty_expiry ? "text-destructive" : ""}>
                Warranty Expiry <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <ShieldCheck
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.warranty_expiry ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="warranty_expiry"
                  type="date"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.warranty_expiry && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("warranty_expiry")}
                />
              </div>
              {errors.warranty_expiry && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.warranty_expiry.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department_id" className={errors.department_id ? "text-destructive" : ""}>
                Department <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="department_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11",
                        errors.department_id && "border-destructive focus:ring-destructive"
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
              {errors.department_id && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.department_id.message}
                </p>
              )}
            </div>

            {/* Maintenance Team */}
            <div className="space-y-2">
              <Label htmlFor="maintenance_team_id" className={errors.maintenance_team_id ? "text-destructive" : ""}>
                Maintenance Team <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="maintenance_team_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11",
                        errors.maintenance_team_id && "border-destructive focus:ring-destructive"
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
              {errors.maintenance_team_id && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.maintenance_team_id.message}
                </p>
              )}
            </div>

            {/* Owner ID (Temporary text input - should be a user dropdown) */}
            <div className="space-y-2">
              <Label htmlFor="owner_id" className={errors.owner_id ? "text-destructive" : ""}>
                Owner ID <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Crown
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.owner_id ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="owner_id"
                  type="number"
                  placeholder="Enter owner user ID"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.owner_id && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("owner_id", { valueAsNumber: true })}
                />
              </div>
              {errors.owner_id && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.owner_id.message}
                </p>
              )}
            </div>

            {/* Default Technician ID (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="default_technician_id">Default Technician ID</Label>
              <div className="relative">
                <UserCheck
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                />
                <Input
                  id="default_technician_id"
                  type="number"
                  placeholder="Optional"
                  className="pl-10 h-11"
                  {...register("default_technician_id", { valueAsNumber: true })}
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
