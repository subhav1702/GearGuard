"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
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
import { teamsApi, MaintenanceTeam } from "@/lib/api/teams";
import { departmentsApi, Department } from "@/lib/api/departments";
import { toast } from "sonner";
import { AlertTriangle, Users, Building2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CreateTeamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    team?: MaintenanceTeam | null;
}

export function CreateTeamDialog({
    open,
    onOpenChange,
    onSuccess,
    team,
}: CreateTeamDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDeps, setLoadingDeps] = useState(false);
    const isEditMode = !!team;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<TeamInput>({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            name: "",
            department_id: undefined,
        },
    });

    useEffect(() => {
        if (open) {
            loadDepartments();
            if (team) {
                reset({
                    name: team.name,
                    department_id: team.department_id,
                });
            } else {
                reset({
                    name: "",
                    department_id: undefined,
                });
            }
        }
    }, [open, team, reset]);

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

    const onSubmit: SubmitHandler<TeamInput> = async (data) => {
        setIsSubmitting(true);
        try {
            if (isEditMode && team) {
                await teamsApi.update(team.id, data);
                toast.success("Maintenance team updated successfully!");
            } else {
                await teamsApi.create(data);
                toast.success("Maintenance team created successfully!");
            }
            reset();
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            console.error("Error submitting team form:", error);
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} team`);
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
                        <DialogTitle className="text-2xl font-bold">
                            {isEditMode ? "Edit Maintenance Team" : "Create Maintenance Team"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">
                            {isEditMode
                                ? "Update the maintenance team details below."
                                : "Add a new maintenance team to manage equipment servicing."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white">
                    {departments.length === 0 && !loadingDeps && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                            <div className="text-sm">
                                <p className="font-bold">No departments found</p>
                                <p className="opacity-80">Please add a department first before creating a team.</p>
                            </div>
                        </div>
                    )}
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
                                    {isEditMode ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                isEditMode ? "Update Team" : "Create Team"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
