"use client";

import { useState } from "react";
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
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { teamsApi } from "@/lib/api/teams";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addMemberSchema = z.object({
    userId: z.string().min(1, "User ID is required").refine((val) => !isNaN(Number(val)), "User ID must be a number"),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

interface AddMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string | null;
    onSuccess?: () => void;
}

export function AddMemberDialog({
    open,
    onOpenChange,
    teamId,
    onSuccess,
}: AddMemberDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddMemberFormValues>({
        resolver: zodResolver(addMemberSchema),
    });

    const addMemberMutation = useMutation({
        mutationFn: ({ teamId, userId }: { teamId: string; userId: number }) =>
            teamsApi.addMember(teamId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            toast.success("Member added successfully");
            reset();
            onOpenChange(false);
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add member");
        },
    });

    const onSubmit = (data: AddMemberFormValues) => {
        if (!teamId) return;
        addMemberMutation.mutate({ teamId, userId: parseInt(data.userId) });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Add Team Member</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Enter the User ID of the technician you want to add to this team.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="userId" className={errors.userId ? "text-destructive" : ""}>
                            User ID <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="userId"
                            placeholder="e.g., 5"
                            className={errors.userId ? "border-destructive" : ""}
                            {...register("userId")}
                        />
                        {errors.userId && (
                            <p className="text-xs font-bold text-destructive mt-1">
                                {errors.userId.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl font-bold h-11"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={addMemberMutation.isPending}
                            className="rounded-xl font-bold h-11 px-8 bg-slate-900 hover:bg-slate-800 text-white"
                        >
                            {addMemberMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Adding...
                                </>
                            ) : (
                                "Add Member"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
