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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Factory, Hash, Tag, Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const workCenterSchema = z.object({
  name: z.string().min(2, "Work Center name is required"),
  code: z.string().min(2, "Work Center code is required"),
  category: z.string().min(2, "Category is required"),
  department: z.string().min(2, "Department is required"),
});

type WorkCenterFormValues = z.infer<typeof workCenterSchema>;

interface CreateWorkCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WorkCenterFormValues) => void;
}

export function CreateWorkCenterDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateWorkCenterDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkCenterFormValues>({
    resolver: zodResolver(workCenterSchema),
  });

  const handleFormSubmit = async (data: WorkCenterFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmit(data);
    setIsSubmitting(false);
    reset();
    onOpenChange(false);
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
                <Label
                  htmlFor="category"
                  required
                  className={errors.category ? "text-destructive" : ""}
                >
                  Category
                </Label>
                <div className="relative">
                  <Tag
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                      errors.category ? "text-destructive" : "text-slate-400"
                    )}
                  />
                  <Input
                    id="category"
                    placeholder="Production..."
                    className={cn(
                      "pl-10 h-11 transition-all",
                      errors.category && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("category")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="department"
                  required
                  className={errors.department ? "text-destructive" : ""}
                >
                  Department
                </Label>
                <div className="relative">
                  <Building2
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                      errors.department ? "text-destructive" : "text-slate-400"
                    )}
                  />
                  <Input
                    id="department"
                    placeholder="Manufacturing..."
                    className={cn(
                      "pl-10 h-11 transition-all",
                      errors.department && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("department")}
                  />
                </div>
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
