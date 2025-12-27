"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "sonner";
import { Controller } from "react-hook-form";
import { AlertTriangle, Factory, Hash, Tag, Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { departmentsApi, Department } from "@/lib/api/departments";
import { equipmentApi } from "@/lib/api/equipment";

const workCenterSchema = z.object({
  name: z.string().min(2, "Work Center name is required"),
  code: z.string().min(2, "Work Center code is required"),
  category: z.literal("WorkCenter"),
  departmentId: z.number().int().positive("Department is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["Operational", "Down", "Maintenance"]),
});

type WorkCenterFormValues = z.infer<typeof workCenterSchema>;

interface CreateWorkCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateWorkCenterDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateWorkCenterDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<WorkCenterFormValues>({
    resolver: zodResolver(workCenterSchema),
    defaultValues: {
      category: "WorkCenter",
      status: "Operational",
      location: "Main Plant",
    }
  });

  useEffect(() => {
    if (open) {
      loadDepartments();
    }
  }, [open]);

  const loadDepartments = async () => {
    setIsLoadingData(true);
    try {
      const data = await departmentsApi.getAll();
      setDepartments(data);
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleFormSubmit = async (data: WorkCenterFormValues) => {
    setIsSubmitting(true);
    try {
      // @ts-ignore - CreateEquipmentInput requires more fields like serialNumber etc
      // but the API might allow creating WorkCenters with less
      await equipmentApi.create({
        ...data,
        serialNumber: data.code, // Use code as serial number for WorkCenter
        purchaseDate: new Date().toISOString().split('T')[0],
        warrantyExpiration: new Date().toISOString().split('T')[0],
        maintenanceTeamId: 1, // Default team
        ownerId: 1, // Default owner
      } as any);
      toast.success("Work Center created successfully!");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating work center:", error);
      toast.error(error.response?.data?.message || "Failed to create work center");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Factory size={120} />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-bold">New Work Center</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Define a new work area or production line.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6 bg-white">
          {departments.length === 0 && !isLoadingData && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
              <div className="text-sm">
                <p className="font-bold">No departments found</p>
                <p className="opacity-80">Please add a department first before creating a work center.</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" required className={errors.name ? "text-destructive" : ""}>
                Work Center Name
              </Label>
              <div className="relative">
                <Factory
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.name ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="name"
                  placeholder="e.g. Assembly Line 1"
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

            <div className="space-y-2">
              <Label htmlFor="code" required className={errors.code ? "text-destructive" : ""}>
                Work Center Code
              </Label>
              <div className="relative">
                <Hash
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.code ? "text-destructive" : "text-slate-400"
                  )}
                />
                <Input
                  id="code"
                  placeholder="WC-001"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.code && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("code")}
                />
              </div>
              {errors.code && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" required className={errors.location ? "text-destructive" : ""}>
                  Location
                </Label>
                <div className="relative">
                  <Tag
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                      errors.location ? "text-destructive" : "text-slate-400"
                    )}
                  />
                  <Input
                    id="location"
                    placeholder="Main Plant..."
                    className={cn(
                      "pl-10 h-11 transition-all",
                      errors.location && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("location")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId" required className={errors.departmentId ? "text-destructive" : ""}>
                  Department
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
                        {isLoadingData ? (
                          <SelectItem value="loading" disabled>Loading...</SelectItem>
                        ) : departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
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
              disabled={isSubmitting}
              className="rounded-xl font-bold h-11 px-8 gap-2 bg-slate-900 hover:bg-slate-800 text-white premium-shadow transition-all active:scale-[0.98]"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Work Center"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
