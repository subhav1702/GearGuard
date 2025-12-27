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
import {
  Wrench,
  Hash,
  Tag,
  Building2,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const assetSchema = z.object({
  name: z.string().min(2, "Asset name is required"),
  serialNumber: z.string().min(3, "Serial number is required"),
  category: z.string().min(2, "Category is required"),
  department: z.string().min(2, "Department is required"),
  location: z.string().min(2, "Location is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  warrantyExpiration: z.string().min(1, "Warranty expiration is required"),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface CreateAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AssetFormValues) => void;
}

export function CreateAssetDialog({ open, onOpenChange, onSubmit }: CreateAssetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
  });

  const handleFormSubmit = async (data: AssetFormValues) => {
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
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
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
            <div className="space-y-2">
              <Label htmlFor="name" required className={errors.name ? "text-destructive" : ""}>
                Asset Name
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

            <div className="space-y-2">
              <Label
                htmlFor="serialNumber"
                required
                className={errors.serialNumber ? "text-destructive" : ""}
              >
                Serial Number
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
                  placeholder="CNC-2023-XYZ"
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
                  placeholder="Production, IT, Fleet..."
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
                  placeholder="Manufacturing, IT..."
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.department && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("department")}
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <Label
                htmlFor="location"
                required
                className={errors.location ? "text-destructive" : ""}
              >
                Location
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
                  placeholder="Floor A - Section 2"
                  className={cn(
                    "pl-10 h-11 transition-all",
                    errors.location && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("location")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="purchaseDate"
                required
                className={errors.purchaseDate ? "text-destructive" : ""}
              >
                Purchase Date
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
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="warrantyExpiration"
                required
                className={errors.warrantyExpiration ? "text-destructive" : ""}
              >
                Warranty Expiration
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
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-slate-100 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl font-bold h-11 px-6 text-slate-500 hover:bg-slate-50"
            >
              Cancel Operation
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl font-bold h-11 px-8 gap-2 bg-slate-900 hover:bg-slate-800 text-white premium-shadow transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Finalize Registration"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
