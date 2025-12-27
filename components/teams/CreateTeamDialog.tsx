"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamSchema, TeamInput } from "@/lib/validations/teams";
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
import { Users, Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { teamsApi } from "@/lib/api/teams";
import { departmentsApi, Department } from "@/lib/api/departments";
import { toast } from "sonner";

interface CreateTeamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateTeamDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateTeamDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDeps, setLoadingDeps] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<TeamInput>({
        resolver: zodResolver(teamSchema),
    });

    useEffect(() => {
        if (open) {
            loadDepartments();
        }
    }, [open]);

    const loadDepartments = async () => {
        setLoadingDeps(true);
        try {
            const data = await departmentsApi.getAll();
            setDepartments(data);
        } catch (error) {
            console.error("Error loading departments:", error);
            toast.error("Failed to load departments");
        } finally {
            setLoadingDeps(false);
        }
    };

    const onSubmit = async (data: TeamInput) => {
        setIsSubmitting(true);
        try {
            await teamsApi.create(data);
            toast.success("Maintenance team created successfully!");
            reset();
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            console.error("Error creating team:", error);
            toast.error(error.response?.data?.message || "Failed to create team");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                        <Users size={100} />
                    </div>
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-bold">Create Maintenance Team</DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            Add a new maintenance team to manage equipment servicing.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white">
                    {/* Team Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                            Team Name <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Users
                                className={cn(
                                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                    errors.name ? "text-destructive" : "text-slate-400"
                                )}
                            />
                            <Input
                                id="name"
                                placeholder="e.g., Mechanical Team, Electrical Team"
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
                                    Creating...
                                </>
                            ) : (
                                "Create Team"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
