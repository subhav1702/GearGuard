"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  correctiveRequestSchema,
  preventiveRequestSchema,
  CorrectiveRequestInput,
  PreventiveRequestInput,
} from "@/lib/validations/maintenance-requests";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wrench, AlertTriangle, CalendarCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { maintenanceRequestsApi } from "@/lib/api/maintenance-requests";
import { equipmentApi, Equipment } from "@/lib/api/equipment";
import { toast } from "sonner";

interface MaintenanceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MaintenanceRequestDialog({
  open,
  onOpenChange,
  onSuccess,
}: MaintenanceRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestType, setRequestType] = useState<"corrective" | "preventive">("corrective");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loadingEquipment, setLoadingEquipment] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CorrectiveRequestInput | PreventiveRequestInput>({
    resolver: zodResolver(
      requestType === "corrective" ? correctiveRequestSchema : preventiveRequestSchema
    ),
    defaultValues: {
      request_type: requestType,
    },
  });

  useEffect(() => {
    if (open) {
      loadEquipment();
    }
  }, [open]);

  const loadEquipment = async () => {
    setLoadingEquipment(true);
    try {
      const data = await equipmentApi.getAll();
      setEquipment(data);
    } catch (error) {
      console.error("Error loading equipment:", error);
      toast.error("Failed to load equipment list");
    } finally {
      setLoadingEquipment(false);
    }
  };

  const onSubmit = async (data: CorrectiveRequestInput | PreventiveRequestInput) => {
    setIsSubmitting(true);
    try {
      if (requestType === "corrective") {
        await maintenanceRequestsApi.createCorrective(data as CorrectiveRequestInput);
      } else {
        await maintenanceRequestsApi.createPreventive(data as PreventiveRequestInput);
      }
      toast.success("Maintenance request created successfully!");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating request:", error);
      toast.error(error.response?.data?.message || "Failed to create maintenance request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Wrench size={120} />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-bold">Create Maintenance Request</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Report a breakdown or schedule preventive maintenance.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white">
          {/* Request Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Request Type</Label>
            <RadioGroup
              value={requestType}
              onValueChange={(value) => setRequestType(value as "corrective" | "preventive")}
              className="flex gap-4"
            >
              <div className="flex-1">
                <RadioGroupItem value="corrective" id="corrective" className="peer sr-only" />
                <Label
                  htmlFor="corrective"
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-4 cursor-pointer rounded-2xl border-2 transition-all",
                    requestType === "corrective"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      "w-6 h-6",
                      requestType === "corrective" ? "text-red-500" : "text-slate-400"
                    )}
                  />
                  <div className="text-center">
                    <p className="font-bold text-sm">Corrective</p>
                    <p className="text-xs opacity-75">Breakdown/Emergency</p>
                  </div>
                </Label>
              </div>

              <div className="flex-1">
                <RadioGroupItem value="preventive" id="preventive" className="peer sr-only" />
                <Label
                  htmlFor="preventive"
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 p-4 cursor-pointer rounded-2xl border-2 transition-all",
                    requestType === "preventive"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  )}
                >
                  <CalendarCheck
                    className={cn(
                      "w-6 h-6",
                      requestType === "preventive" ? "text-blue-500" : "text-slate-400"
                    )}
                  />
                  <div className="text-center">
                    <p className="font-bold text-sm">Preventive</p>
                    <p className="text-xs opacity-75">Scheduled Service</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className={errors.subject ? "text-destructive" : ""}>
              Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subject"
              placeholder={
                requestType === "corrective"
                  ? "e.g., Hydraulic Oil Leak"
                  : "e.g., Quarterly Inspection"
              }
              className={cn(
                "h-11",
                errors.subject && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Equipment Selection */}
          <div className="space-y-2">
            <Label htmlFor="equipment_id" className={errors.equipment_id ? "text-destructive" : ""}>
              Equipment <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="equipment_id"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                >
                  <SelectTrigger
                    className={cn(
                      "h-11",
                      errors.equipment_id && "border-destructive focus:ring-destructive"
                    )}
                  >
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingEquipment ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : equipment.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        No equipment found
                      </SelectItem>
                    ) : (
                      equipment.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id.toString()}>
                          {eq.name} - {eq.serial_number}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.equipment_id && (
              <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                {errors.equipment_id.message}
              </p>
            )}
          </div>

          {/* Scheduled Date/Time (Only for Preventive) */}
          {requestType === "preventive" && (
            <div className="space-y-2">
              <Label
                htmlFor="scheduled_at"
                className={"scheduled_at" in errors && errors.scheduled_at ? "text-destructive" : ""}
              >
                Scheduled Date & Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                className={cn(
                  "h-11",
                  "scheduled_at" in errors && errors.scheduled_at && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("scheduled_at" as any)}
              />
              {"scheduled_at" in errors && errors.scheduled_at && (
                <p className="text-[10px] font-bold text-destructive mt-1 ml-1">
                  {errors.scheduled_at.message}
                </p>
              )}
            </div>
          )}

          <input type="hidden" {...register("request_type")} value={requestType} />

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
              disabled={isSubmitting || loadingEquipment}
              className="rounded-xl font-bold h-11 px-8 gap-2 bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
