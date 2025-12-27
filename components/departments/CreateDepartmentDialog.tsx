"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { departmentSchema, DepartmentInput } from "@/lib/validations/departments";
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
import { Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { departmentsApi, Department } from "@/lib/api/departments";
import { toast } from "sonner";

interface CreateDepartmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    department?: Department | null;
}

export function CreateDepartmentDialog({
    open,
    onOpenChange,
    onSuccess,
    department,
}: CreateDepartmentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!department;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DepartmentInput>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (department) {
                reset({ name: department.name });
            } else {
                reset({ name: "" });
            }
        }
    }, [open, department, reset]);

    const onSubmit = async (data: DepartmentInput) => {
        setIsSubmitting(true);
        try {
            if (isEditMode && department) {
                await departmentsApi.update(department.id, data);
                toast.success("Department updated successfully!");
            } else {
                await departmentsApi.create(data);
                toast.success("Department created successfully!");
            }
            reset();
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            console.error("Error submitting department form:", error);
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} department`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                        <Building2 size={100} />
                    </div>
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-bold">
                            {isEditMode ? "Edit Department" : "Create Department"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            {isEditMode
                                ? "Update the department details below."
                                : "Add a new department to organize your equipment and teams."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white">
                    <div className="space-y-2">
                        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                            Department Name <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Building2
                                className={cn(
                                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                    errors.name ? "text-destructive" : "text-slate-400"
                                )}
                            />
                            <Input
                                id="name"
                                placeholder="e.g., Production, IT, Fleet"
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
                            className="rounded-xl font-bold h-11 px-8 gap-2 bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isEditMode ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                isEditMode ? "Update Department" : "Create Department"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
